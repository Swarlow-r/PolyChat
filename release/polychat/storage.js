/**
 * ConversationStorage - 对话存储管理器
 * 存储结构：两级分组（AI应用 → 聊天会话）
 * - 存储key: chat_conversations
 * - Conversation ID格式: conv_{siteId}_{conversationId}
 * - conversationId从URL提取，与标题解耦
 */
class ConversationStorage {
  constructor() {
    this.STORAGE_KEY = 'chat_conversations';
    this.META_KEY = 'chat_conversations_meta';
    this.SITES = {
      doubao: { name: '豆包', color: '#00b894' },
      yuanbao: { name: '元宝', color: '#0984e3' },
      kimi: { name: 'Kimi', color: '#a29bfe' },
      deepseek: { name: 'DeepSeek', color: '#4a6fa5' },
      gemini: { name: 'Gemini', color: '#4285f4' },
      grok: { name: 'Grok', color: '#1da1f2' },
      yiyan: { name: '文心一言', color: '#2932e1' }
    };

    // ── 内存缓存（P0优化：避免每次操作全量读写chrome.storage） ──
    this._cache = { conversations: {}, meta: {} };
    this._cacheLoaded = false;
    this._dirty = false;
    this._flushTimer = null;
    this._FLUSH_DELAY_MS = 2000; // 2秒后flush
    this._MAX_FLUSH_DELAY_MS = 8000; // 最长8秒必须flush一次
    this._maxFlushTimer = null;
  }

  // ═══════════════════════════════════════════════
  // 内存缓存层
  // ═══════════════════════════════════════════════

  /**
   * 确保内存缓存已加载
   * @private
   */
  async _ensureCache() {
    if (!this._cacheLoaded) {
      this._cache = await this._rawGetAll();
      this._cacheLoaded = true;
    }
  }

  /**
   * 标记缓存为脏，启动延迟写入
   * @private
   */
  _markDirty() {
    this._dirty = true;
    // 清除现有定时器
    if (this._flushTimer) clearTimeout(this._flushTimer);
    // 延迟flush
    this._flushTimer = setTimeout(() => {
      this.flush();
    }, this._FLUSH_DELAY_MS);
    // 最长等待时间
    if (!this._maxFlushTimer) {
      this._maxFlushTimer = setTimeout(() => {
        this.flush();
      }, this._MAX_FLUSH_DELAY_MS);
    }
  }

  /**
   * 立即将缓存写入 chrome.storage
   * @returns {Promise<void>}
   */
  async flush() {
    if (!this._dirty) return;
    this._dirty = false;
    if (this._flushTimer) { clearTimeout(this._flushTimer); this._flushTimer = null; }
    if (this._maxFlushTimer) { clearTimeout(this._maxFlushTimer); this._maxFlushTimer = null; }
    try {
      await chrome.storage.local.set({
        [this.STORAGE_KEY]: this._cache.conversations,
        [this.META_KEY]: this._cache.meta
      });
    } catch (e) {
      console.error('[StorageManager] flush失败:', e);
      this._dirty = true; // 重新标记为脏，下次再试
    }
  }

  /**
   * 直接从 chrome.storage 读取（绕过缓存，用于初始加载）
   * @private
   */
  async _rawGetAll() {
    const result = await chrome.storage.local.get([this.STORAGE_KEY, this.META_KEY]);
    return {
      conversations: result[this.STORAGE_KEY] || {},
      meta: result[this.META_KEY] || {}
    };
  }

  /**
   * 从内存缓存获取所有数据（同步，无需 await）
   * @private
   * @returns {{ conversations: Object, meta: Object }}
   */
  _getCached() {
    return this._cache;
  }

  // ==================== URL解析工具 ====================

  /**
   * 从URL提取conversationId
   * @param {string} url - 页面URL
   * @param {string} siteId - 站点ID
   * @returns {string|null} conversationId或null（新对话页面）
   */
  extractConversationId(url, siteId) {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;

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

        case 'deepseek': {
          const matchDS = path.match(/\/(?:a\/chat\/s|chat)\/([^\/]+)/);
          return matchDS ? matchDS[1] : null;
        }

        case 'gemini': {
          // Gemini URL格式: /app/{conversationId} 或 /app（新对话）
          const matchGemini = path.match(/^\/app\/([^\/]+)$/);
          return matchGemini ? matchGemini[1] : null;
        }
        
        case 'yiyan': {
          // 文心一言 URL格式: /chat/{conversationId} 或 /（新对话）
          const matchYiyan = path.match(/^\/chat\/([^\/?#]+)\/?$/);
          return matchYiyan ? matchYiyan[1] : null;
        }

        default:
          return null;
      }
    } catch (e) {
      console.error('[StorageManager] 解析URL失败:', e);
      return null;
    }
  }

  /**
   * 判断是否为AI聊天页面
   * @param {string} url - 页面URL
   * @returns {string|null} siteId或null
   */
  detectSite(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;

      if (hostname.includes('doubao.com')) return 'doubao';
      if (hostname.includes('yuanbao.tencent.com')) return 'yuanbao';
      if (hostname.includes('kimi.com') || hostname.includes('kimi.moonshot.cn')) return 'kimi';
      if (hostname.includes('chat.deepseek.com')) return 'deepseek';
      if (hostname === 'gemini.google.com') return 'gemini';
      if (hostname.includes('yiyan.baidu.com')) return 'yiyan';

      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * 生成存储ID（conversationId统一用base64+前缀编码）
   * 所有ID都用 'e:' 前缀 + base64 编码，确保往返可靠
   * @param {string} siteId - 站点ID
   * @param {string} conversationId - 对话ID
   * @returns {string} 存储ID
   */
  makeId(siteId, conversationId) {
    const encoded = btoa(unescape(encodeURIComponent(conversationId)));
    return `conv_${siteId}_e:${encoded}`;
  }

  /**
   * 从存储ID解析原始conversationId（makeId的逆操作）
   * 检测到 'e:' 前缀时进行 base64 解码
   * @param {string} id - 存储ID
   * @returns {string|null} 原始conversationId
   */
  parseId(id) {
    const match = id.match(/^conv_([^_]+)_(.+)$/);
    if (!match) return null;
    const [, siteId, rest] = match;
    // 有 'e:' 前缀表示是编码的ID
    if (rest.startsWith('e:')) {
      try {
        return decodeURIComponent(escape(atob(rest.slice(2))));
      } catch {
        return null;
      }
    }
    // 无前缀：直接返回（兼容旧格式或本身不含特殊字符的ID）
    return rest;
  }

  // ==================== 核心CRUD操作（内存缓存版） ====================

  /**
   * 获取所有对话（走内存缓存）
   * @returns {Promise<Object>} { conversations: {}, meta: {} }
   */
  async getAll() {
    await this._ensureCache();
    return { conversations: this._cache.conversations, meta: this._cache.meta };
  }

  /**
   * 保存所有对话（走内存缓存 + 延迟写入）
   */
  async saveAll(conversations, meta) {
    await this._ensureCache();
    this._cache.conversations = conversations;
    this._cache.meta = meta;
    this._markDirty();
  }

  /**
   * 获取单个对话（包含完整消息，走内存缓存）
   * @param {string} id - 对话ID
   * @returns {Promise<Object|null>}
   */
  async getConversation(id) {
    await this._ensureCache();
    const { conversations, meta } = this._cache;
    const conversation = conversations[id];
    if (!conversation) return null;

    return {
      ...conversation,
      ...meta[id],
      messages: conversation.messages || []
    };
  }

  /**
   * 创建或更新对话（内存缓存版）
   */
  async upsertConversation(data) {
    const { siteId, conversationId, url, title, customName, tabId } = data;

    if (!siteId || !conversationId) {
      throw new Error('siteId和conversationId不能为空');
    }

    const id = this.makeId(siteId, conversationId);
    const now = Date.now();

    await this._ensureCache();
    const { conversations, meta } = this._cache;

    let isNew = false;
    if (!conversations[id]) {
      isNew = true;
      conversations[id] = {
        id, siteId, conversationId, url,
        messages: [],
        createdAt: now
      };
      meta[id] = {
        title: title || '',
        customName: customName || '',
        messageCount: 0,
        lastTabId: tabId,
        updatedAt: now
      };
    } else {
      conversations[id].url = url;
      if (title && title.length > 0) meta[id].title = title;
      if (customName !== undefined && customName !== null) meta[id].customName = customName;
      meta[id].lastTabId = tabId;
      meta[id].updatedAt = now;
    }

    this._markDirty();

    return {
      id, isNew,
      conversation: { ...conversations[id], ...meta[id] }
    };
  }

  /**
   * 批量添加消息（内存缓存版）
   */
  async addMessages(id, messages) {
    if (!messages || messages.length === 0) return null;

    await this._ensureCache();
    const { conversations, meta } = this._cache;
    if (!conversations[id]) return null;

    const conversation = conversations[id];
    const now = Date.now();

    const existingFingerprints = new Set(
      (conversation.messages || []).map(m => this._fingerprint(m.role, m.content))
    );

    const newMessages = messages.filter(m => {
      const fp = this._fingerprint(m.role, m.content);
      if (existingFingerprints.has(fp)) return false;
      existingFingerprints.add(fp);
      return true;
    });

    if (newMessages.length === 0) {
      return { added: 0, conversation: { ...conversation, ...meta[id] } };
    }

    conversation.messages = [
      ...(conversation.messages || []),
      ...newMessages.map(m => ({ ...m, id: m.id || this._generateMessageId() }))
    ];
    conversation.messages.sort((a, b) => a.timestamp - b.timestamp);

    meta[id].messageCount = conversation.messages.length;
    meta[id].updatedAt = now;

    this._markDirty();

    return {
      added: newMessages.length,
      conversation: { ...conversation, ...meta[id] }
    };
  }

  /**
   * 全量设置消息（内存缓存版）
   */
  async setMessages(id, messages) {
    if (!messages) return null;

    await this._ensureCache();
    const { conversations, meta } = this._cache;
    if (!conversations[id]) return null;

    const now = Date.now();
    conversations[id].messages = messages.map(m => ({
      ...m, id: m.id || this._generateMessageId()
    }));
    meta[id].messageCount = conversations[id].messages.length;
    meta[id].updatedAt = now;

    this._markDirty();

    return {
      replaced: messages.length,
      conversation: { ...conversations[id], ...meta[id] }
    };
  }

  /**
   * 更新最后一条助手消息（内存缓存版）
   */
  async updateLastAssistantMessage(id, content) {
    await this._ensureCache();
    const { conversations, meta } = this._cache;
    if (!conversations[id]) return null;

    const messages = conversations[id].messages || [];
    if (messages.length === 0) return null;

    let lastAssistantMsg = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') { lastAssistantMsg = messages[i]; break; }
    }
    if (!lastAssistantMsg) return null;

    lastAssistantMsg.content = content;
    meta[id].updatedAt = Date.now();

    this._markDirty();

    return { conversation: { ...conversations[id], ...meta[id] } };
  }

  /**
   * 标记最后一条助手消息为完成（内存缓存版）
   */
  async markLastAssistantComplete(id) {
    await this._ensureCache();
    const { conversations, meta } = this._cache;
    if (!conversations[id]) return null;

    const messages = conversations[id].messages || [];
    if (messages.length === 0) return null;

    let lastAssistantMsg = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') { lastAssistantMsg = messages[i]; break; }
    }
    if (lastAssistantMsg) {
      lastAssistantMsg.isComplete = true;
      meta[id].updatedAt = Date.now();
      this._markDirty();
    }

    return { conversation: { ...conversations[id], ...meta[id] } };
  }

  /**
   * 重命名对话（内存缓存版）
   */
  async renameConversation(id, customName) {
    await this._ensureCache();
    const { conversations, meta } = this._cache;
    if (!conversations[id]) return false;

    meta[id].customName = customName;
    meta[id].updatedAt = Date.now();

    this._markDirty();
    return true;
  }

  /**
   * 删除对话（内存缓存版）
   */
  async deleteConversation(id) {
    await this._ensureCache();
    const { conversations, meta } = this._cache;

    delete conversations[id];
    delete meta[id];

    this._markDirty();
    return true;
  }

  /**
   * 删除消息（内存缓存版）
   */
  async deleteMessages(id, messageIds) {
    await this._ensureCache();
    const { conversations, meta } = this._cache;
    if (!conversations[id]) return false;

    const conversation = conversations[id];
    const messageIdSet = new Set(messageIds);

    conversation.messages = (conversation.messages || []).filter(m => !messageIdSet.has(m.id));
    meta[id].messageCount = conversation.messages.length;
    meta[id].updatedAt = Date.now();

    this._markDirty();
    return true;
  }

  // ==================== 查询接口（内存缓存版） ====================

  /**
   * 按AI应用分组列出所有对话（高性能：只返回元信息，走内存缓存）
   */
  async listBySite() {
    await this._ensureCache();
    const { conversations, meta } = this._cache;

    const result = { doubao: [], yuanbao: [], kimi: [], deepseek: [], gemini: [], grok: [], yiyan: [] };

    for (const id of Object.keys(conversations)) {
      const conv = conversations[id];
      const m = meta[id] || {};
      if (result[conv.siteId]) {
        result[conv.siteId].push({
          id, siteId: conv.siteId, conversationId: conv.conversationId,
          url: conv.url || '',
          title: m.title || '', customName: m.customName || '',
          messageCount: m.messageCount || 0,
          updatedAt: m.updatedAt || conv.createdAt,
          createdAt: conv.createdAt
        });
      }
    }

    for (const siteId of Object.keys(result)) {
      result[siteId].sort((a, b) => b.updatedAt - a.updatedAt);
    }

    return result;
  }

  /**
   * 获取所有对话列表（平铺，用于兼容）
   * @returns {Promise<Array>}
   */
  async listConversations() {
    const bySite = await this.listBySite();
    const all = [
      ...bySite.doubao,
      ...bySite.yuanbao,
      ...bySite.kimi,
      ...bySite.deepseek,
      ...bySite.gemini,
      ...bySite.grok,
      ...bySite.yiyan
    ];
    return all.sort((a, b) => b.updatedAt - a.updatedAt);
  }

  /**
   * 搜索对话（内存缓存版）
   */
  async searchConversations(query) {
    await this._ensureCache();
    const { conversations, meta } = this._cache;
    const results = [];
    const lowerQuery = query.toLowerCase();

    for (const id of Object.keys(conversations)) {
      const conv = conversations[id];
      const m = meta[id] || {};

      if ((m.title && m.title.toLowerCase().includes(lowerQuery)) ||
          (m.customName && m.customName.toLowerCase().includes(lowerQuery))) {
        results.push({
          id, siteId: conv.siteId, conversationId: conv.conversationId,
          url: conv.url || '',
          title: m.title || '', customName: m.customName || '',
          messageCount: m.messageCount || 0,
          updatedAt: m.updatedAt || conv.createdAt,
          createdAt: conv.createdAt
        });
        continue;
      }

      const foundInMessage = (conv.messages || []).some(msg =>
        msg.content && msg.content.toLowerCase().includes(lowerQuery)
      );
      if (foundInMessage) {
        results.push({
          id, siteId: conv.siteId, conversationId: conv.conversationId,
          url: conv.url || '',
          title: m.title || '', customName: m.customName || '',
          messageCount: m.messageCount || 0,
          updatedAt: m.updatedAt || conv.createdAt,
          createdAt: conv.createdAt
        });
      }
    }

    return results.sort((a, b) => b.updatedAt - a.updatedAt);
  }

  // ==================== 工具方法 ====================

  /**
   * 生成消息指纹用于去重
   * @private
   */
  _fingerprint(role, content) {
    const text = content || '';
    const prefix = text.slice(0, 50);
    const suffix = text.slice(-50);
    return `${role}:${prefix}...${suffix}`;
  }

  /**
   * 生成消息唯一ID
   * @private
   */
  _generateMessageId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  /**
   * 获取存储统计（内存缓存版）
   */
  async getStorageStats() {
    await this._ensureCache();
    const { conversations, meta } = this._cache;

    let totalConversations = 0;
    let totalMessages = 0;
    const bySite = { doubao: 0, yuanbao: 0, kimi: 0, deepseek: 0, gemini: 0 };

    for (const id of Object.keys(conversations)) {
      const conv = conversations[id];
      const m = meta[id] || {};
      totalConversations++;
      totalMessages += m.messageCount || 0;
      if (bySite[conv.siteId] !== undefined) bySite[conv.siteId]++;
    }

    return { totalConversations, totalMessages, bySite };
  }

  /**
   * 清理过期数据（内存缓存版）
   */
  async cleanupExpired(maxAge = 30 * 24 * 60 * 60 * 1000) {
    await this._ensureCache();
    const { conversations, meta } = this._cache;
    const now = Date.now();
    let deleted = 0;

    for (const id of Object.keys(conversations)) {
      const m = meta[id];
      if (m && (now - m.updatedAt > maxAge)) {
        delete conversations[id];
        delete meta[id];
        deleted++;
      }
    }

    if (deleted > 0) this._markDirty();
    return { deleted };
  }

  /**
   * 导出所有数据（内存缓存版）
   */
  async exportAll() {
    await this._ensureCache();
    return {
      version: '2.0',
      exportTime: Date.now(),
      conversations: this._cache.conversations,
      meta: this._cache.meta
    };
  }

  /**
   * 导入数据（内存缓存版）
   */
  async importAll(data) {
    if (!data.conversations || !data.meta) {
      throw new Error('无效的数据格式');
    }
    await this._ensureCache();
    this._cache.conversations = data.conversations;
    this._cache.meta = data.meta;
    this._markDirty();
    return true;
  }
}

// 创建全局实例
const storageManager = new ConversationStorage();

// 兼容旧API（用于background.js平滑过渡）
const legacyAdapter = {
  listSessions: () => storageManager.listConversations(),
  getSession: (id) => storageManager.getConversation(id),
  upsertSession: (data) => storageManager.upsertConversation(data),
  addMessage: (id, message) => storageManager.addMessages(id, [message]),
  updateLastAssistantMessage: (id, content) => storageManager.updateLastAssistantMessage(id, content),
  markLastAssistantComplete: (id) => storageManager.markLastAssistantComplete(id),
  renameSession: (id, name) => storageManager.renameConversation(id, name),
  deleteSession: (id) => storageManager.deleteConversation(id),
  deleteMessages: (id, messageIds) => storageManager.deleteMessages(id, messageIds),
  cleanupExpired: (maxAge) => storageManager.cleanupExpired(maxAge),
  getStorageStats: () => storageManager.getStorageStats()
};

// 暴露到 Service Worker 全局（background.js 直接运行时使用）
if (typeof self !== 'undefined') {
  self.ConversationStorage = ConversationStorage;
  self.storageManager = storageManager;
  self.legacyAdapter = legacyAdapter;
}

// CommonJS 导出（兼容 bundling / Node 环境）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ConversationStorage, storageManager, legacyAdapter };
}
