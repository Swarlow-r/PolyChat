/**
 * PolyChat - Background Service Worker (v2)
 *
 * 核心改动：
 * - 存储从 Session 改为 Conversation
 * - 使用 conversationId 作为唯一标识（从URL提取）
 * - 支持多Tab合并存储
 * - 新对话页面不自动存储，等URL出现ID后存储
 */

if (typeof importScripts === 'function') {
  importScripts('storage.js');
}
const sm = self.storageManager;
if (!sm) {
  throw new Error('storageManager 未加载，无法启动后台服务');
}

// ── 可配置常量 ──
const CONFIG = {
  // 流式请求超时时间（毫秒）
  STREAM_TIMEOUT_MS: 120000,
  // 普通请求超时时间（毫秒）
  REQUEST_TIMEOUT_MS: 120000,
  // DOM 等待超时（毫秒）
  DOM_WAIT_TIMEOUT_MS: 15000,
};

const SUPPORTED_ORIGINS = [
  'https://www.doubao.com',
  'https://yuanbao.tencent.com',
  'https://www.kimi.com',
  'https://chat.deepseek.com',
  'https://gemini.google.com',
  'https://grok.com',
  'https://yiyan.baidu.com',
];

const SUPPORTED_URL_PATTERNS = [
  'https://www.doubao.com/chat*',
  'https://yuanbao.tencent.com/chat*',
  'https://www.kimi.com/*',
  'https://chat.deepseek.com/*',
  'https://gemini.google.com/*',
  'https://grok.com/*',
  'https://yiyan.baidu.com/*',
];

/** 发送面板固定六站（与 Popup 一致） */
const SEND_PANEL_SITE_IDS = ['doubao', 'yuanbao', 'kimi', 'deepseek', 'gemini', 'grok', 'yiyan'];

const OPEN_PAGE_URLS_STORAGE_KEY = 'open_page_urls';

const DEFAULT_OPEN_PAGE_URLS = {
  doubao: 'https://www.doubao.com/chat/',
  yuanbao: 'https://yuanbao.tencent.com/chat/naQivTmsDa',
  kimi: 'https://www.kimi.com/zh/',
  deepseek: 'https://chat.deepseek.com/',
  gemini: 'https://gemini.google.com/app',
  grok: 'https://grok.com/',
  yiyan: 'https://yiyan.baidu.com/',
};

// ── URL和站点工具 ──

function getSiteId(url) {
  try {
    const u = new URL(url);
    if (u.hostname === 'www.doubao.com') return 'doubao';
    if (u.hostname === 'yuanbao.tencent.com') return 'yuanbao';
    if (u.hostname === 'www.kimi.com') return 'kimi';
    if (u.hostname === 'chat.deepseek.com') return 'deepseek';
    if (u.hostname === 'gemini.google.com') return 'gemini';
    if (u.hostname === 'grok.com') return 'grok';
    if (u.hostname === 'yiyan.baidu.com') return 'yiyan';
  } catch (_) {}
  return null;
}

/**
 * 从URL提取conversationId
 */
function extractConversationId(url, siteId) {
  try {
    const u = new URL(url);
    const path = u.pathname;

    switch (siteId) {
      case 'doubao': {
        const matchDb = path.match(/\/chat\/(.+)$/);
        if (!matchDb) return null;
        const rawDb = matchDb[1];
        if (/^local_/i.test(rawDb)) return null;
        return rawDb;
      }
      case 'yuanbao': {
        const matchYb = path.match(/^\/chat\/(.+)$/);
        if (!matchYb) return null;
        const restYb = matchYb[1];
        if (restYb.indexOf('/') === -1) return null;
        const firstSegYb = restYb.split('/')[0];
        if (/^local_/i.test(firstSegYb)) return null;
        return restYb;
      }
      case 'kimi':
        // /chat/{conversationId} (新格式，2024年后) 或 /zh/chat/{conversationId} (旧格式)
        const match2 = path.match(/\/chat\/([^\/]+)$/) || path.match(/\/zh\/chat\/([^\/]+)$/);
        return match2 ? match2[1] : null;
      case 'deepseek':
        // DeepSeek URL格式: /a/chat/s/{conversationId} 或 /chat/{id}
        const matchDS = path.match(/\/(?:a\/chat\/s|chat)\/([^\/]+)/);
        return matchDS ? matchDS[1] : null;
      case 'gemini':
        // Gemini URL格式: /app/{conversationId} 或 /app（新对话）
        const matchGemini = path.match(/^\/app\/([^\/]+)$/);
        return matchGemini ? matchGemini[1] : null;
      case 'grok':
        // Grok URL格式: /c/{conversationId}?rid={...} 或 /（新对话）
        const matchGrok = path.match(/^\/c\/([^\/\?]+)/);
        return matchGrok ? matchGrok[1] : null;
      case 'yiyan':
        // 文心一言 URL格式: /chat/{conversationId} 或 /（新对话）
        const matchYiyan = path.match(/^\/chat\/([^\/?#]+)\/?$/);
        return matchYiyan ? matchYiyan[1] : null;
      default:
        return null;
    }
  } catch (_) {
    return null;
  }
}

/**
 * 在新标签页打开会话保存的页面 URL（不做页内滚动定位）
 */
async function handleLocateConversationTab(message) {
  const id = message.id;
  if (!id) {
    return { ok: false, error: '缺少会话 id' };
  }
  const conv = await sm.getConversation(id);
  if (!conv) {
    return { ok: false, error: '会话不存在' };
  }
  const url = conv.url && String(conv.url).trim();
  if (!url) {
    return { ok: false, error: '未记录页面地址，请先在对应网站打开过本会话' };
  }
  return new Promise((resolve) => {
    chrome.tabs.create({ url, active: true }, (tab) => {
      if (chrome.runtime.lastError || !tab || tab.id == null) {
        resolve({ ok: false, error: chrome.runtime.lastError?.message || '无法打开标签页' });
        return;
      }
      resolve({ ok: true });
    });
  });
}

/**
 * 获取当前所有支持站点的tab列表
 * P2优化：使用url过滤减少不必要的tab返回
 */
async function getSupportedTabs() {
  // 先尝试用url模式过滤，如果支持的话
  try {
    const tabs = await chrome.tabs.query({ url: SUPPORTED_URL_PATTERNS });
    if (tabs && tabs.length > 0) return tabs;
  } catch (_) {
    // 某些版本可能不支持url参数，fallback
  }
  const tabs = await chrome.tabs.query({});
  return tabs.filter((tab) => tab.url && getSiteId(tab.url));
}

async function getMergedOpenPageUrls() {
  const data = await chrome.storage.local.get(OPEN_PAGE_URLS_STORAGE_KEY);
  const stored = data[OPEN_PAGE_URLS_STORAGE_KEY] || {};
  const out = { ...DEFAULT_OPEN_PAGE_URLS };
  for (const id of SEND_PANEL_SITE_IDS) {
    if (stored[id] && String(stored[id]).trim()) {
      out[id] = String(stored[id]).trim();
    }
  }
  return out;
}

/**
 * 当前窗口内该站点标签：按 lastAccessed 取最近激活的一条
 */
async function pickTabForSiteCurrentWindow(siteId) {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const candidates = tabs.filter((t) => t.url && getSiteId(t.url) === siteId);
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0));
  return candidates[0];
}

async function resolveSiteIdsToTabIdsCurrentWindow(siteIds) {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const tabIds = [];
  for (const siteId of siteIds) {
    const candidates = tabs.filter((t) => t.url && getSiteId(t.url) === siteId);
    if (candidates.length === 0) {
      return { ok: false, missingSiteId: siteId };
    }
    candidates.sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0));
    tabIds.push(candidates[0].id);
  }
  return { ok: true, tabIds };
}

/**
 * 在当前窗口已打开的标签内跳转到各站「新会话」入口 URL（与「打开」页及用户配置的 open_page_urls 一致），不新开标签。
 */
async function handleNavigateSelectedToNewSession(siteIds) {
  if (!Array.isArray(siteIds) || siteIds.length === 0) {
    return { ok: false, error: '未选择站点' };
  }
  for (const id of siteIds) {
    if (!SEND_PANEL_SITE_IDS.includes(id)) {
      return { ok: false, error: `无效站点: ${id}` };
    }
  }
  const resolved = await resolveSiteIdsToTabIdsCurrentWindow(siteIds);
  if (!resolved.ok) {
    return { ok: false, error: `当前窗口未打开：${resolved.missingSiteId}` };
  }
  const urls = await getMergedOpenPageUrls();
  const results = [];
  for (let i = 0; i < siteIds.length; i++) {
    const siteId = siteIds[i];
    const tabId = resolved.tabIds[i];
    const url = urls[siteId];
    if (!url || !String(url).trim()) {
      results.push({ siteId, tabId, ok: false, error: '未配置新会话地址' });
      continue;
    }
    try {
      await new Promise((resolve, reject) => {
        chrome.tabs.update(tabId, { url: String(url).trim() }, () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          resolve();
        });
      });
      results.push({ siteId, tabId, ok: true });
    } catch (e) {
      results.push({ siteId, tabId, ok: false, error: String(e && e.message ? e.message : e) });
    }
  }
  const allOk = results.every((r) => r.ok);
  return { ok: allOk, results, error: allOk ? undefined : '部分站点未能跳转' };
}

async function handleOpenOrFocusSite(siteId) {
  if (!SEND_PANEL_SITE_IDS.includes(siteId)) {
    return { ok: false, error: '无效站点' };
  }
  const urls = await getMergedOpenPageUrls();
  const openUrl = urls[siteId];
  if (!openUrl) {
    return { ok: false, error: '未配置打开地址' };
  }
  const tab = await pickTabForSiteCurrentWindow(siteId);
  if (!tab) {
    return new Promise((resolve) => {
      chrome.tabs.create({ url: openUrl, active: false }, (created) => {
        if (chrome.runtime.lastError || !created) {
          resolve({ ok: false, error: chrome.runtime.lastError?.message || '无法打开标签页' });
          return;
        }
        resolve({ ok: true, action: 'created' });
      });
    });
  }
  return { ok: true, action: 'already-open', tabId: tab.id };
}

async function handleFocusSiteTab(siteId) {
  if (!SEND_PANEL_SITE_IDS.includes(siteId)) {
    return { ok: false, error: '无效站点' };
  }
  const tab = await pickTabForSiteCurrentWindow(siteId);
  if (!tab) {
    return { ok: false, error: '当前窗口无该站点页面' };
  }
  await chrome.tabs.update(tab.id, { active: true });
  await chrome.windows.update(tab.windowId, { focused: true });
  return { ok: true, tabId: tab.id };
}

async function checkSitesTabPresenceCurrentWindow() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const presence = {};
  for (const siteId of SEND_PANEL_SITE_IDS) {
    presence[siteId] = tabs.some((t) => t.url && getSiteId(t.url) === siteId);
  }
  return { ok: true, presence };
}

function startStreamToTabs(tabIds, promptTrimmed, sendResponse) {
  const requestId = createRequestId();
  ensureStreamState(requestId, tabIds);
  const timeoutMs = CONFIG.STREAM_TIMEOUT_MS;
  tabIds.forEach((tabId) => {
    sendToTabStream(tabId, promptTrimmed, requestId, timeoutMs);
  });
  sendResponse({ ok: true, requestId, tabIds });
}

// ── 启动时清理过期数据 ──
chrome.runtime.onInstalled.addListener(async () => {
  await sm.cleanupExpired();
  try {
    const data = await chrome.storage.local.get(OPEN_PAGE_URLS_STORAGE_KEY);
    const cur = data[OPEN_PAGE_URLS_STORAGE_KEY];
    if (!cur || typeof cur !== 'object') {
      await chrome.storage.local.set({ [OPEN_PAGE_URLS_STORAGE_KEY]: { ...DEFAULT_OPEN_PAGE_URLS } });
      return;
    }
    const next = { ...cur };
    let dirty = false;
    for (const id of SEND_PANEL_SITE_IDS) {
      if (!next[id] || !String(next[id]).trim()) {
        next[id] = DEFAULT_OPEN_PAGE_URLS[id];
        dirty = true;
      }
    }
    if (dirty) await chrome.storage.local.set({ [OPEN_PAGE_URLS_STORAGE_KEY]: next });
  } catch (e) {
    console.warn('[PolyChat] 初始化 open_page_urls 失败:', e);
  }
});

// ── 消息路由 ──
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const type = message?.type;

  // ====== Content → Background：对话捕获相关 ======

  if (type === 'CAPTURE_CONVERSATIONS') {
    handleCaptureConversations(message, sender).then(sendResponse);
    return true;
  }

  if (type === 'CONVERSATION_UPDATED') {
    handleConversationUpdated(message, sender).catch(e => console.error('[PolyChat] CONVERSATION_UPDATED 异常:', e));
    return false;
  }

  if (type === 'STREAM_DONE') {
    handleContentStreamDone(message);
    return false;
  }

  // ====== Content → Background：Tab注册 ======

  if (type === 'REGISTER_TAB') {
    handleRegisterTab(message, sender).then(sendResponse);
    return true;
  }

  /** Content：豆包 local_* → 正式 ID 迁移时删除占位会话 */
  if (type === 'DELETE_CONVERSATION_BY_SITE_CONV') {
    const sid = message.siteId;
    const cid = message.conversationId;
    if (!sid || cid == null || cid === '') {
      sendResponse({ ok: false, error: '缺少 siteId 或 conversationId' });
      return false;
    }
    const id = sm.makeId(sid, String(cid));
    sm.deleteConversation(id)
      .then(() => sendResponse({ ok: true, id }))
      .catch((e) => sendResponse({ ok: false, error: String(e && e.message ? e.message : e) }));
    return true;
  }

  if (type === 'OPEN_OR_FOCUS_SITE') {
    const siteId = message.siteId;
    handleOpenOrFocusSite(siteId).then(sendResponse).catch((e) => sendResponse({ ok: false, error: String(e) }));
    return true;
  }

  if (type === 'FOCUS_SITE_TAB') {
    const siteId = message.siteId;
    handleFocusSiteTab(siteId).then(sendResponse).catch((e) => sendResponse({ ok: false, error: String(e) }));
    return true;
  }

  if (type === 'NAVIGATE_SELECTED_TO_NEW_SESSION') {
    const siteIds = message.siteIds;
    handleNavigateSelectedToNewSession(Array.isArray(siteIds) ? siteIds : [])
      .then(sendResponse)
      .catch((e) => sendResponse({ ok: false, error: String(e) }));
    return true;
  }

  if (type === 'CHECK_SITES_TAB_PRESENCE') {
    checkSitesTabPresenceCurrentWindow().then(sendResponse).catch((e) => sendResponse({ ok: false, error: String(e) }));
    return true;
  }

  if (type === 'GET_OPEN_PAGE_URLS') {
    getMergedOpenPageUrls().then((urls) => sendResponse({ ok: true, urls })).catch((e) => sendResponse({ ok: false, error: String(e) }));
    return true;
  }

  // ====== Popup → Background：获取支持站点Tab列表 ======

  if (type === 'GET_SUPPORTED_TABS') {
    getSupportedTabs().then((tabs) => {
      sendResponse({
        tabs: tabs.map((t) => ({
          id: t.id,
          title: t.title,
          url: t.url,
          siteId: getSiteId(t.url),
        })),
      });
    });
    return true;
  }

  // ====== Popup → Background：会话管理（新API） ======

  // 列出所有对话（按站点分组）
  if (type === 'LIST_CONVERSATIONS') {
    sm.listBySite().then(sendResponse);
    return true;
  }

  // 获取单个对话（含完整messages）
  if (type === 'GET_CONVERSATION') {
    sm.getConversation(message.id).then(sendResponse);
    return true;
  }

  // 重命名对话
  if (type === 'RENAME_CONVERSATION') {
    sm.renameConversation(message.id, message.customName).then(sendResponse);
    return true;
  }

  // 删除对话
  if (type === 'DELETE_CONVERSATION') {
    sm.deleteConversation(message.id).then(sendResponse);
    return true;
  }

  // 删除消息
  if (type === 'DELETE_MESSAGES') {
    sm.deleteMessages(message.id, message.messageIds).then(sendResponse);
    return true;
  }

  // 搜索对话
  if (type === 'SEARCH_CONVERSATIONS') {
    sm.searchConversations(message.query).then(sendResponse);
    return true;
  }

  // 在新标签打开会话保存的页面 URL
  if (type === 'LOCATE_CONVERSATION_TAB') {
    handleLocateConversationTab(message).then(sendResponse);
    return true;
  }

  // 获取存储统计
  if (type === 'GET_STORAGE_STATS') {
    sm.getStorageStats().then(sendResponse);
    return true;
  }

  // 导出数据
  if (type === 'EXPORT_DATA') {
    sm.exportAll().then(sendResponse);
    return true;
  }

  // 导入数据
  if (type === 'IMPORT_DATA') {
    sm.importAll(message.data).then(sendResponse);
    return true;
  }

  // ====== 兼容旧API（用于平滑过渡） ======

  if (type === 'LIST_SESSIONS') {
    sm.listConversations().then(sendResponse);
    return true;
  }

  if (type === 'GET_SESSION') {
    sm.getConversation(message.sessionId).then(sendResponse);
    return true;
  }

  if (type === 'RENAME_SESSION') {
    sm.renameConversation(message.sessionId, message.newName).then(sendResponse);
    return true;
  }

  if (type === 'DELETE_SESSION') {
    sm.deleteConversation(message.sessionId).then(sendResponse);
    return true;
  }

  // ====== Popup → Background：发送问题（一键发送功能保留） ======

  if (type === 'SEND_TO_TABS') {
    const { tabIds, prompt } = message;
    if (!Array.isArray(tabIds) || !prompt || typeof prompt !== 'string') {
      sendResponse({ ok: false, error: '缺少 tabIds 或 prompt' });
      return false;
    }
    Promise.all(tabIds.map((tabId) => sendToTab(tabId, prompt.trim()))).then((results) => {
      sendResponse({ ok: true, results });
    });
    return true;
  }

  if (type === 'SEND_TO_TABS_STREAM') {
    const { tabIds, siteIds, prompt } = message;
    if (!prompt || typeof prompt !== 'string') {
      sendResponse({ ok: false, error: '缺少 prompt' });
      return false;
    }
    const trimmed = prompt.trim();

    if (Array.isArray(siteIds) && siteIds.length > 0) {
      resolveSiteIdsToTabIdsCurrentWindow(siteIds)
        .then((res) => {
          if (!res.ok) {
            sendResponse({ ok: false, error: `当前窗口未打开：${res.missingSiteId}` });
            return;
          }
          startStreamToTabs(res.tabIds, trimmed, sendResponse);
        })
        .catch((e) => sendResponse({ ok: false, error: String(e) }));
      return true;
    }

    if (!Array.isArray(tabIds) || tabIds.length === 0) {
      sendResponse({ ok: false, error: '缺少 tabIds 或 siteIds' });
      return false;
    }
    startStreamToTabs(tabIds, trimmed, sendResponse);
    return false;
  }

  // P3优化：取消正在进行的流式请求
  if (type === 'CANCEL_STREAM_REQUEST') {
    const { requestId } = message;
    if (!requestId) {
      sendResponse({ ok: false, error: '缺少 requestId' });
      return true;
    }
    const state = streamStates.get(requestId);
    if (!state) {
      sendResponse({ ok: true, error: '请求已结束或不存在' });
      return true;
    }
    // 标记为取消状态（所有内部判断都会跳过）
    state.cancelled = true;
    // 清除所有Tab的定时器
    for (const [tabId, timer] of state.tabTimers) {
      clearTimeout(timer);
    }
    state.tabTimers.clear();
    // 所有未完成的Tab标记为取消
    for (const tabId of state.expectedTabIds) {
      if (!state.doneTabIds.has(tabId)) {
        state.doneTabIds.add(tabId);
        sendStreamDone({ requestId, tabId, siteId: null, status: 'cancelled', answer: null, error: '用户取消' });
      }
    }
    streamStates.delete(requestId);
    console.log('[PolyChat] 请求已取消:', requestId);
    sendResponse({ ok: true });
    return true;
  }

  sendResponse({ ok: false, error: '未知消息类型' });
  return false;
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('popup/popup.html') });
});

// ── Tab注册 ──

/**
 * 处理Content Script的Tab注册
 * 核心逻辑：
 * 1. 提取conversationId
 * 2. 无ID时不注册（不存储新对话页面）
 * 3. 有ID时upsertConversation
 */
async function handleRegisterTab(message, sender) {
  const tab = sender.tab;
  if (!tab) return { ok: false, error: '无法识别来源Tab' };

  const siteId = message.siteId || getSiteId(tab.url);
  if (!siteId) return { ok: false, error: '不支持的站点' };

  const url = message.url || tab.url;
  const conversationId = message.conversationId || extractConversationId(url, siteId);

  // 无conversationId：新对话页面，不存储
  if (!conversationId) {
    return {
      ok: true,
      hasConversationId: false,
      conversationId: null,
      id: null
    };
  }

  const result = await sm.upsertConversation({
    siteId,
    conversationId,
    url,
    title: message.title || tab.title || '',
    tabId: tab.id
  });

  return {
    ok: true,
    hasConversationId: true,
    conversationId,
    id: result.id,
    isNew: result.isNew
  };
}

// ── 对话捕获处理 ──

/**
 * 处理Content Script发来的完整对话捕获请求
 * 首次激活页面或用户主动触发时调用
 *
 * 策略：CAPTURE_CONVERSATIONS = 全量快照覆盖（不是追加）
 * 这是Content Script发来的"当前页面完整消息列表"，应直接覆盖存储中的messages
 */
async function handleCaptureConversations(message, sender) {
  const { conversations, conversationId, url, title } = message;
  const tab = sender.tab;

  if (!tab || !Array.isArray(conversations)) {
    return { ok: false, error: '无效的对话数据' };
  }

  const siteId = getSiteId(url || tab.url);
  if (!siteId) return { ok: false, error: '不支持的站点' };

  // 如果没有conversationId，说明是新对话页面（无ID），不存储
  if (!conversationId) {
    return { ok: true, skipped: true, reason: '新对话页面，无conversationId' };
  }

  const id = sm.makeId(siteId, conversationId);

  // 先upsert对话
  await sm.upsertConversation({
    siteId,
    conversationId,
    url: url || tab.url,
    title: title || tab.title || '',
    tabId: tab.id
  });

  // 转换消息格式
  const messages = conversations.map(c => ({
    role: c.role,
    content: c.content,
    timestamp: c.timestamp || Date.now(),
    isComplete: c.isComplete !== false,
    messageKey: c.messageKey ? String(c.messageKey) : undefined
  }));

  // DeepSeek 特殊策略：
  // - 保持全量 capture
  // - 写入时按 messageKey 去重
  // - 若最后一条 messageKey 相同，仍覆盖（处理流式输出）
  if (siteId === 'deepseek') {
    const conv = await sm.getConversation(id);
    const existingMessages = conv?.messages || [];
    const mergedMessages = mergeDeepseekMessagesByKey(existingMessages, messages);
    await sm.setMessages(id, mergedMessages);
    return {
      ok: true,
      id,
      replaced: mergedMessages.length
    };
  }

  // 其他站点维持原全量覆盖
  await sm.setMessages(id, messages);

  return {
    ok: true,
    id,
    replaced: messages.length
  };
}

function mergeDeepseekMessagesByKey(existingMessages, incomingMessages) {
  if (!Array.isArray(incomingMessages) || incomingMessages.length === 0) {
    return Array.isArray(existingMessages) ? existingMessages : [];
  }

  const merged = Array.isArray(existingMessages) ? existingMessages.map(m => ({ ...m })) : [];
  const keyToIndex = new Map();

  for (let i = 0; i < merged.length; i++) {
    const key = merged[i]?.messageKey;
    if (key) keyToIndex.set(key, i);
  }

  const lastIndex = incomingMessages.length - 1;
  for (let i = 0; i < incomingMessages.length; i++) {
    const msg = incomingMessages[i];
    const key = msg?.messageKey;
    const isLast = i === lastIndex;

    if (!key) {
      // 无主键时退化为追加，避免误丢
      merged.push({ ...msg });
      continue;
    }

    const existingIndex = keyToIndex.get(key);
    if (existingIndex == null) {
      merged.push({ ...msg });
      keyToIndex.set(key, merged.length - 1);
      continue;
    }

    // 同 key：仅最后一条允许覆盖（流式输出）
    if (isLast) {
      merged[existingIndex] = { ...merged[existingIndex], ...msg };
    }
  }

  return merged;
}

/**
 * Content 侧已改为仅 CAPTURE_CONVERSATIONS 全量同步；此入口仅刷新会话元数据（兼容旧版或其它调用方）
 */
async function handleConversationUpdated(message, sender) {
  const { id, url, title, conversationId: providedConversationId } = message;
  if (!id || !url) return;

  const siteId = getSiteId(url);
  if (!siteId) return;

  const conversationId = providedConversationId || extractConversationId(url, siteId);
  if (!conversationId) return;

  try {
    await sm.upsertConversation({
      siteId,
      conversationId,
      url,
      title: title || '',
      tabId: sender.tab?.id,
    });
  } catch (e) {
    console.error('[PolyChat] CONVERSATION_UPDATED upsert 失败:', e);
  }
}

// ── 一键发送功能（保留） ──

function sendToTab(tabId, prompt) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({ siteId: null, tabId, status: 'timeout', answer: null, error: '等待回答超时' });
    }, CONFIG.REQUEST_TIMEOUT_MS);

    function doSend() {
      chrome.tabs.sendMessage(tabId, { type: 'SEND_PROMPT', prompt }, (response) => {
        clearTimeout(timeout);
        if (chrome.runtime.lastError) {
          resolve({ siteId: null, tabId, status: 'error', answer: null, error: chrome.runtime.lastError.message });
          return;
        }
        const siteId = response?.siteId ?? (response?.url ? getSiteId(response.url) : null);
        resolve({
          siteId: siteId || null,
          tabId,
          status: response?.status === 'ok' ? 'success' : 'error',
          answer: response?.answer ?? null,
          error: response?.error ?? null,
        });
      });
    }

    chrome.scripting.executeScript({ target: { tabId }, files: ['content/content.js'] }, () => {
      if (chrome.runtime.lastError) {
        clearTimeout(timeout);
        resolve({ siteId: null, tabId, status: 'error', answer: null, error: '注入脚本失败: ' + (chrome.runtime.lastError.message || '') });
        return;
      }
      doSend();
    });
  });
}

// ── 流式协议实现 ──

const streamStates = new Map();

function createRequestId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getTabSiteId(tabId) {
  return new Promise((resolve) => {
    chrome.tabs.get(tabId, (tab) => {
      resolve(getSiteId(tab?.url || '') || null);
    });
  });
}

function sendStreamDone({ requestId, tabId, siteId, status, answer, error }) {
  chrome.runtime.sendMessage({
    type: 'STREAM_DONE',
    requestId, tabId,
    siteId: siteId || null,
    status, answer: answer ?? null, error: error ?? null,
  });
}

function ensureStreamState(requestId, expectedTabIds) {
  let state = streamStates.get(requestId);
  if (!state) {
    // state 结构：expectedTabIds(预期Tab集合), doneTabIds(已完成Tab集合), tabTimers(Map<TabId, Timer>), cancelled(是否已取消)
    state = { expectedTabIds: new Set(expectedTabIds), doneTabIds: new Set(), tabTimers: new Map(), cancelled: false };
    streamStates.set(requestId, state);
  }
  return state;
}

function maybeFinalizeStream(requestId, state) {
  if (state.cancelled) return; // P3：已取消的请求不触发完成回调
  if (state.doneTabIds.size >= state.expectedTabIds.size) {
    streamStates.delete(requestId);
  }
}

// P3优化：定期清理过期的 streamStates，防止内存泄漏
setInterval(() => {
  const now = Date.now();
  for (const [reqId, state] of streamStates) {
    if (state.doneTabIds.size >= state.expectedTabIds.size) {
      streamStates.delete(reqId);
    }
  }
}, 60000); // 每分钟清理一次

function handleContentStreamDone(message) {
  const { requestId, tabId } = message;
  if (!requestId || tabId == null) return;
  const state = streamStates.get(requestId);
  if (!state || state.cancelled) return;
  if (state.doneTabIds.has(tabId)) return;
  state.doneTabIds.add(tabId);
  const timer = state.tabTimers.get(tabId);
  if (timer) { clearTimeout(timer); state.tabTimers.delete(tabId); }
  maybeFinalizeStream(requestId, state);
}

/**
 * 实际执行发送到Tab的逻辑（供首次调用和重试调用）
 * @private
 */
function _doSendToTab(tabId, prompt, requestId, siteId, timeoutMs) {
  const state = streamStates.get(requestId);
  if (!state || state.doneTabIds.has(tabId) || state.cancelled) return;

  chrome.scripting.executeScript({ target: { tabId }, files: ['content/content.js'] }, () => {
    if (chrome.runtime.lastError) {
      if (!state.doneTabIds.has(tabId) && !state.cancelled) {
        state.doneTabIds.add(tabId);
        const t = state.tabTimers.get(tabId);
        if (t) clearTimeout(t);
        state.tabTimers.delete(tabId);
        sendStreamDone({ requestId, tabId, siteId, status: 'error', answer: null, error: '注入脚本失败: ' + (chrome.runtime.lastError.message || '') });
        maybeFinalizeStream(requestId, state);
      }
      return;
    }

    chrome.tabs.sendMessage(tabId, { type: 'START_STREAM', requestId, prompt, tabId }, () => {
      if (chrome.runtime.lastError) {
        if (!state.doneTabIds.has(tabId) && !state.cancelled) {
          state.doneTabIds.add(tabId);
          const t = state.tabTimers.get(tabId);
          if (t) clearTimeout(t);
          state.tabTimers.delete(tabId);
          sendStreamDone({ requestId, tabId, siteId, status: 'error', answer: null, error: '发送START_STREAM失败: ' + (chrome.runtime.lastError.message || '') });
          maybeFinalizeStream(requestId, state);
        }
      }
    });
  });
}

async function sendToTabStream(tabId, prompt, requestId, timeoutMs) {
  const stateSiteId = await getTabSiteId(tabId);
  const siteId = stateSiteId || null;
  const state = streamStates.get(requestId);
  if (!state) return;

  const timer = setTimeout(() => {
    if (state.doneTabIds.has(tabId)) return;
    if (state.cancelled) return;
    state.doneTabIds.add(tabId);
    state.tabTimers.delete(tabId);
    sendStreamDone({ requestId, tabId, siteId, status: 'timeout', answer: null, error: '等待回答超时' });
    maybeFinalizeStream(requestId, state);
  }, timeoutMs);
  state.tabTimers.set(tabId, timer);

  // 执行发送
  _doSendToTab(tabId, prompt, requestId, siteId, timeoutMs);
}

// ── Phase 2: 主动轮询检测系统 ──

/**
 * 对话轮询管理器
 * 职责：
 * 1. 定期扫描所有活跃的Tab
 * 2. 检测对话数量/内容变化
 * 3. 触发同步机制
 * 4. 智能调整轮询频率
 */
class ConversationPollingManager {
  constructor() {
    this._pollingTimer = null;
    this._isRunning = false;
    
    // Phase 2: 基础轮询配置
    this._POLL_INTERVAL_MS = 10000; // 默认10秒轮询一次
    
    // Phase 3: 智能调度配置
    this._siteConfigs = {
      doubao: {
        enabled: true,
        baseInterval: 10000,      // 基础间隔10秒
        activeInterval: 5000,     // 活跃Tab: 5秒
        idleInterval: 15000,      // 空闲Tab: 15秒
        backgroundInterval: 30000, // 后台Tab: 30秒
        priority: 'high'
      },
      yuanbao: {
        enabled: true,
        baseInterval: 10000,
        activeInterval: 5000,
        idleInterval: 15000,
        backgroundInterval: 30000,
        priority: 'high'
      },
      kimi: {
        enabled: true,
        baseInterval: 12000,
        activeInterval: 6000,
        idleInterval: 18000,
        backgroundInterval: 36000,
        priority: 'normal'
      },
      deepseek: {
        enabled: true,
        baseInterval: 12000,
        activeInterval: 6000,
        idleInterval: 18000,
        backgroundInterval: 36000,
        priority: 'normal'
      },
      gemini: {
        enabled: true,
        baseInterval: 12000,
        activeInterval: 6000,
        idleInterval: 18000,
        backgroundInterval: 36000,
        priority: 'normal'
      },
      grok: {
        enabled: true,
        baseInterval: 12000,
        activeInterval: 6000,
        idleInterval: 18000,
        backgroundInterval: 36000,
        priority: 'normal'
      },
      yiyan: {
        enabled: true,
        baseInterval: 10000,
        activeInterval: 5000,
        idleInterval: 15000,
        backgroundInterval: 30000,
        priority: 'high'
      }
    };
    
    // Tab状态追踪
    this._tabStates = new Map(); // tabId -> { lastPollTime, lastMessageCount, lastContentHash, status }
    
    // 性能监控 (Phase 3)
    this._stats = {
      totalPolls: 0,
      successfulPolls: 0,
      failedPolls: 0,
      changesDetected: 0,
      avgPollDuration: 0
    };
  }
  
  /**
   * 启动轮询
   */
  start() {
    if (this._isRunning) {
      console.log('[PolyChat] 轮询管理器已在运行');
      return;
    }
    
    this._isRunning = true;
    console.log('[PolyChat] 启动对话轮询管理器，间隔:', this._POLL_INTERVAL_MS, 'ms');
    
    this._scheduleNextPoll();
  }
  
  /**
   * 停止轮询
   */
  stop() {
    if (this._pollingTimer) {
      clearTimeout(this._pollingTimer);
      this._pollingTimer = null;
    }
    this._isRunning = false;
    console.log('[PolyChat] 轮询管理器已停止');
  }
  
  /**
   * 调度下一次轮询
   */
  _scheduleNextPoll() {
    if (!this._isRunning) return;
    
    this._pollingTimer = setTimeout(() => {
      this._doPoll().then(() => {
        this._scheduleNextPoll();
      }).catch((err) => {
        console.error('[PolyChat] 轮询异常:', err);
        this._scheduleNextPoll();
      });
    }, this._POLL_INTERVAL_MS);
  }
  
  /**
   * 执行一轮轮询
   */
  async _doPoll() {
    const startTime = Date.now();
    this._stats.totalPolls++;
    
    try {
      // 获取所有支持的Tab
      const tabs = await getSupportedTabs();
      
      if (tabs.length === 0) {
        return;
      }
      
      console.log('[PolyChat] 轮询扫描', tabs.length, '个Tab');
      
      // 并行轮询所有Tab
      const results = await Promise.allSettled(
        tabs.map(tab => this._pollTab(tab))
      );
      
      // 统计结果
      let successCount = 0;
      let failCount = 0;
      let changeCount = 0;
      
      results.forEach((result, idx) => {
        if (result.status === 'fulfilled') {
          successCount++;
          if (result.value?.hasChanges) {
            changeCount++;
          }
        } else {
          failCount++;
        }
      });
      
      this._stats.successfulPolls += successCount;
      this._stats.failedPolls += failCount;
      this._stats.changesDetected += changeCount;
      
      // 更新平均轮询时长
      const duration = Date.now() - startTime;
      this._stats.avgPollDuration = (this._stats.avgPollDuration * 0.9 + duration * 0.1);
      
      console.log(`[PolyChat] 轮询完成: ${successCount}成功/${failCount}失败, ${changeCount}个变化, 耗时${duration}ms`);
      
    } catch (err) {
      console.error('[PolyChat] 轮询执行失败:', err);
      this._stats.failedPolls++;
    }
  }
  
  /**
   * 轮询单个Tab
   * @returns {Promise<{hasChanges: boolean}>}
   */
  async _pollTab(tab) {
    const tabId = tab.id;
    const url = tab.url;
    const siteId = getSiteId(url);
    
    if (!siteId) {
      return { hasChanges: false };
    }
    
    const config = this._siteConfigs[siteId];
    if (!config || !config.enabled) {
      return { hasChanges: false };
    }
    
    // 检查是否需要轮询（基于时间间隔）
    const tabState = this._tabStates.get(tabId) || {};
    const now = Date.now();
    const elapsed = now - (tabState.lastPollTime || 0);
    
    // Phase 3: 根据Tab状态调整轮询间隔
    let interval = config.baseInterval;
    const tabStatus = await this._getTabStatus(tabId);
    
    if (tabStatus === 'active') {
      interval = config.activeInterval;
    } else if (tabStatus === 'idle') {
      interval = config.idleInterval;
    } else if (tabStatus === 'background') {
      interval = config.backgroundInterval;
    }
    
    // 如果距离上次轮询时间不足，跳过
    if (elapsed < interval && tabState.lastPollTime) {
      return { hasChanges: false, skipped: true };
    }
    
    // 发送轮询请求到Content Script
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({ hasChanges: false, error: 'timeout' });
      }, 5000); // 单个Tab轮询超时5秒
      
      chrome.tabs.sendMessage(tabId, { type: 'POLL_CONVERSATION' }, (response) => {
        clearTimeout(timeout);
        
        if (chrome.runtime.lastError) {
          // Content Script可能未加载，尝试注入
          this._ensureContentScript(tabId).then(() => {
            resolve({ hasChanges: false, injected: true });
          }).catch(() => {
            resolve({ hasChanges: false, error: chrome.runtime.lastError.message });
          });
          return;
        }
        
        // 更新Tab状态
        const hasChanges = response?.hasChanges || false;
        this._tabStates.set(tabId, {
          lastPollTime: now,
          lastMessageCount: response?.messageCount || 0,
          lastContentHash: response?.contentHash || '',
          status: tabStatus
        });
        
        // 如果检测到变化，触发TRIGGER_CAPTURE
        if (hasChanges) {
          console.log(`[PolyChat] Tab ${tabId} 检测到变化，触发全量捕获`);
          this._triggerCapture(tabId);
        }
        
        resolve({ hasChanges, messageCount: response?.messageCount });
      });
    });
  }
  
  /**
   * 获取Tab状态（活跃/空闲/后台）
   * Phase 3: 智能调度
   */
  async _getTabStatus(tabId) {
    return new Promise((resolve) => {
      chrome.tabs.get(tabId, (tab) => {
        if (!tab) {
          resolve('background');
          return;
        }
        
        // 检查是否是当前激活的Tab
        chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
          const isActive = activeTabs.some(t => t.id === tabId);
          
          if (isActive) {
            resolve('active');
          } else if (tab.active) {
            resolve('idle'); // 在其他窗口激活
          } else {
            resolve('background');
          }
        });
      });
    });
  }
  
  /**
   * 确保Content Script已注入
   */
  async _ensureContentScript(tabId) {
    return new Promise((resolve, reject) => {
      chrome.scripting.executeScript({
        target: { tabId },
        files: ['content/content.js']
      }, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  }
  
  /**
   * 触发全量捕获
   */
  _triggerCapture(tabId) {
    chrome.tabs.sendMessage(tabId, { type: 'TRIGGER_CAPTURE' }, () => {
      if (chrome.runtime.lastError) {
        console.warn('[PolyChat] 触发捕获失败:', chrome.runtime.lastError.message);
      }
    });
  }
  
  /**
   * 获取统计信息（Phase 3: 性能监控）
   */
  getStats() {
    return {
      ...this._stats,
      uptime: this._isRunning ? Date.now() : 0,
      tabCount: this._tabStates.size
    };
  }
  
  /**
   * 手动触发立即轮询
   */
  async pollNow() {
    console.log('[PolyChat] 手动触发立即轮询');
    return this._doPoll();
  }
}

// 创建全局轮询管理器实例
const pollingManager = new ConversationPollingManager();

// 启动轮询管理器
pollingManager.start();

// Phase 3: 性能监控API
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_POLLING_STATS') {
    sendResponse(pollingManager.getStats());
    return true;
  }
  
  if (message.type === 'TRIGGER_POLL_NOW') {
    pollingManager.pollNow().then(() => {
      sendResponse({ ok: true });
    }).catch((err) => {
      sendResponse({ ok: false, error: err.message });
    });
    return true;
  }
});
