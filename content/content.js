/**
 * PolyChat - Content Script (v2.1) - MutationObserver Optimized
 *
 * 优化内容：
 * - 缩小 MutationObserver 观察范围到消息容器
 * - 添加消息容器选择器配置
 * - 增强容器定位逻辑
 * - 优化 Observer 配置
 */
(function () {
  'use strict';

  if (typeof window.__MULTI_CHAT_LOADED__ !== 'undefined' && window.__MULTI_CHAT_LOADED__) return;
  window.__MULTI_CHAT_LOADED__ = true;

  // ==================== 基础工具 ====================

  function getSiteId() {
    const h = window.location.hostname;
    if (h.includes('doubao.com')) return 'doubao';
    if (h.includes('yuanbao.tencent.com')) return 'yuanbao';
    if (h.includes('kimi.com')) return 'kimi';
    if (h === 'chat.deepseek.com') return 'deepseek';
    if (h === 'gemini.google.com') return 'gemini';
    if (h === 'grok.com') return 'grok';
    if (h === 'yiyan.baidu.com') return 'yiyan';
    return null;
  }

  function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function cleanAnswerText(t) {
    if (t == null) return '';
    return String(t)
      .replace(/[\u200B-\u200D\uFEFF\u2060]/g, '')
      .replace(/\u00A0/g, ' ');
  }

  // ==================== URL和会话ID工具 ====================

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
        var firstSegYb = restYb.split('/')[0];
        if (/^local_/i.test(firstSegYb)) return null;
        return restYb;
      }
      case 'kimi':
        const match2 = path.match(/\/chat\/([^\/]+)$/) || path.match(/\/zh\/chat\/([^\/]+)$/);
        return match2 ? match2[1] : null;
      case 'deepseek': {
        const matchDS = path.match(/\/(?:a\/chat\/s|chat)\/([^\/]+)/);
        return matchDS ? matchDS[1] : null;
      }
      case 'gemini': {
        const matchGemini = path.match(/^\/app\/([^\/]+)$/);
        return matchGemini ? matchGemini[1] : null;
      }
      case 'grok': {
        const matchGrok = path.match(/^\/c\/([^\/\?]+)/);
        return matchGrok ? matchGrok[1] : null;
      }
      case 'yiyan': {
        const matchYiyan = path.match(/^\/chat\/([^\/?#]+)\/?$/);
        return matchYiyan ? matchYiyan[1] : null;
      }
        default:
          return null;
      }
    } catch (_) {
      return null;
    }
  }

  function getCurrentConversationId() {
    // 文心一言：仅当 URL 为 /chat/{id} 时才有会话 ID；https://yiyan.baidu.com/ 新会话不注册
    var cid = extractConversationId(window.location.href, siteId);
    return cid || null;
  }

  // ==================== DOM解析工具（保留原有功能） ====================

  function isDoubaoLikelyUserBubble(el) {
    var n = el;
    for (var d = 0; d < 28 && n; d++, n = n.parentElement) {
      var cls = (n.className && String(n.className)) || '';
      var tid = n.getAttribute && n.getAttribute('data-testid');
      var role = n.getAttribute && n.getAttribute('data-role');
      if (role === 'user') return true;
      if (tid && /(^|_)(user|human|sender|self)(_|$)/i.test(tid) && !/bot|assistant|ai/i.test(tid)) return true;
      if (/UserMessage|user-message|is-user|human-msg|question-item|message-user|msg-user|message-right|sender-message|HumanMessage|message-item.*user|message-item\s+user/i.test(cls)) return true;
      if (/justify-end|items-end|flex-row-reverse/.test(cls)) return true;
      if (/BotMessage|bot-message|assistant|model-msg|Receiver|receiver|message-bot|msg-bot|message-left|AiMessage|AIMessage|message-item.*assistant|message-item\s+assistant/i.test(cls)) return false;
      if (/items-start|justify-start/.test(cls)) return false;
    }
    return false;
  }

  function stripDoubaoFooter(t) {
    if (t == null || t === '') return t;
    return String(t)
      .replace(/\s*内容由豆包\s*AI\s*生成\s*/gi, '')
      .replace(/\s*内容由\s*AI\s*生成\s*/gi, '')
      .trim();
  }

  function readDoubaoAssistantAnswerText(root) {
    root = root || document.body;
    var unions = root.querySelectorAll('[data-testid="union_message"]');
    if (unions.length) {
      for (var i = unions.length - 1; i >= 0; i--) {
        var block = unions[i].querySelector('[data-testid="message-block-container"]');
        if (!block) continue;
        var isUser = false;
        for (var c = block.firstElementChild; c; c = c.nextElementSibling) {
          if (c.getAttribute && c.getAttribute('data-testid') === 'send_message') {
            isUser = true;
            break;
          }
        }
        if (isUser) continue;
        var raw = stripDoubaoFooter(cleanAnswerText((block.innerText || block.textContent || '').trim()));
        if (raw && raw.length > 2) return raw;
      }
      return null;
    }
    var sel = '[class*="message"] [class*="content"], [class*="answer"], [class*="reply"]';
    var nodes = root.querySelectorAll(sel);
    for (var j = nodes.length - 1; j >= 0; j--) {
      if (isDoubaoLikelyUserBubble(nodes[j])) continue;
      var raw = stripDoubaoFooter(cleanAnswerText((nodes[j].innerText || nodes[j].textContent || '').trim()));
      if (raw && raw.length > 2) return raw;
    }
    return null;
  }

  function readYuanbaoAssistantAnswerText(root) {
    root = root || document.body;
    var aiItems = root.querySelectorAll('.agent-chat__list__item--ai[data-conv-speaker="ai"]');
    if (!aiItems.length) {
      if (root.matches && root.matches('.agent-chat__list__item--ai[data-conv-speaker="ai"]')) {
        aiItems = [root];
      }
    }
    if (!aiItems.length) return null;
    var el = aiItems[aiItems.length - 1];
    var clone = el.cloneNode(true);
    clone.querySelectorAll('.agent-chat__conv--ai__toolbar').forEach(function (tb) { tb.remove(); });
    var raw = cleanAnswerText((clone.innerText || clone.textContent || '').trim());
    if (raw && raw.length > 2) return raw;
    return null;
  }

  function extractYiyanSessionTitle() {
    try {
      // 方法 1: 直接从会话列表中提取所有会话标题
      // 文心一言的会话列表在侧边栏中
      var sessionListSelectors = [
        '.sessionListContainer__Yf1hWF5p',
        '[class*="sessionListContainer"]',
        '[class*="session-list"]',
        '.newHistorySessionListWrapper',
        '[class*="newHistorySessionList"]'
      ];
      
      var sessionList = null;
      for (var ls = 0; ls < sessionListSelectors.length; ls++) {
        try {
          sessionList = document.querySelector(sessionListSelectors[ls]);
          if (sessionList) break;
        } catch (e) {
          continue;
        }
      }
      
      if (sessionList) {
        // 获取所有会话项
        var sessionItemSelectors = [
          '.sessionItemCardSideBar__f__sIwQe',
          '[class*="sessionItemCardSideBar"]',
          '[class*="sessionItem"]',
          '[data-key]'
        ];
        
        var allSessionItems = [];
        for (var si = 0; si < sessionItemSelectors.length; si++) {
          try {
            var items = sessionList.querySelectorAll(sessionItemSelectors[si]);
            if (items.length > 0) {
              allSessionItems = Array.from(items);
              break;
            }
          } catch (e) {
            continue;
          }
        }
        
        // 遍历所有会话项，找到当前选中的
        for (var i = 0; i < allSessionItems.length; i++) {
          var item = allSessionItems[i];
          
          // 检查是否是当前选中的会话
          var isSelected = false;
          var itemClass = item.className || '';
          
          // 检查是否有选中相关的类名
          if (itemClass.indexOf('selected') !== -1 ||
              itemClass.indexOf('active') !== -1 ||
              itemClass.indexOf('current') !== -1) {
            isSelected = true;
          }
          
          // 检查子元素是否有选中状态
          if (!isSelected) {
            var selectedChild = item.querySelector('[class*="selected"], [class*="active"]');
            if (selectedChild) {
              isSelected = true;
            }
          }
          
          // 检查是否与当前 URL 匹配
          if (!isSelected) {
            var dataKey = item.getAttribute('data-key');
            if (dataKey) {
              var urlMatch = window.location.href.match(/\/chat\/([^\/]+)$/);
              if (urlMatch && dataKey.indexOf(urlMatch[1]) !== -1) {
                isSelected = true;
              }
            }
          }
          
          if (isSelected) {
            // 提取标题
            var titleSelectors = [
              '.sessionName___q9htqXT',
              '[class*="sessionName"]',
              '[class*="session-name"]',
              '.sessionName'
            ];
            
            for (var ts = 0; ts < titleSelectors.length; ts++) {
              try {
                var titleEl = item.querySelector(titleSelectors[ts]);
                if (titleEl) {
                  var title = titleEl.textContent.trim();
                  if (title && title.length > 0 && title !== '文心一言') {
                    console.log('[PolyChat] 文心一言提取到标题:', title);
                    return title;
                  }
                }
              } catch (e) {
                continue;
              }
            }
          }
        }
        
        // 如果没有找到选中的，尝试获取第一个会话的标题作为 fallback
        if (allSessionItems.length > 0) {
          var firstItem = allSessionItems[0];
          var titleSelectors = [
            '.sessionName___q9htqXT',
            '[class*="sessionName"]'
          ];
          
          for (var fts = 0; fts < titleSelectors.length; fts++) {
            try {
              var titleEl = firstItem.querySelector(titleSelectors[fts]);
              if (titleEl) {
                var title = titleEl.textContent.trim();
                if (title && title.length > 0 && title !== '文心一言') {
                  console.log('[PolyChat] 文心一言从第一个会话提取标题:', title);
                  return title;
                }
              }
            } catch (e) {
              continue;
            }
          }
        }
      }
      
      // 方法 2: 使用 document.title
      var pageTitle = document.title;
      if (pageTitle && pageTitle !== '文心一言' && pageTitle.length > 0) {
        console.log('[PolyChat] 文心一言从 document.title 提取标题:', pageTitle);
        return pageTitle;
      }
      
      console.log('[PolyChat] 文心一言未能提取到有效标题');
      return null;
    } catch (e) {
      console.warn('[PolyChat] 文心一言会话标题提取失败:', e);
      return null;
    }
  }

  function normalizeKimiKatexInClone(clone) {
    var list = Array.prototype.slice.call(clone.querySelectorAll('.katex'));
    list.forEach(function (k) {
      if (!k.parentNode) return;
      var html = k.querySelector('.katex-html');
      if (html) {
        var span = k.ownerDocument.createElement('span');
        span.textContent = (html.innerText || html.textContent || '').trim();
        k.parentNode.replaceChild(span, k);
      }
    });
  }

  function extractKimiAssistantTextFromElement(el) {
    if (!el || !el.querySelector) return null;
    var segmentAssistant = el.querySelector('.segment-assistant');
    var boxes = segmentAssistant
      ? segmentAssistant.querySelectorAll('.segment-content-box')
      : el.querySelectorAll('.segment-content-box');
    if (!boxes.length) {
      boxes = el.querySelectorAll('[class*="segment-content-box"]');
    }
    if (!boxes.length) {
      boxes = el.querySelectorAll('[class*="markdown-body"], [class*="md-content"], [class*="prose"], [class*="MessageContent"], [class*="message-content"], [class*="segment-content"]');
    }
    if (boxes.length) {
      var clone = boxes[boxes.length - 1].cloneNode(true);
      normalizeKimiKatexInClone(clone);
      clone.querySelectorAll('.user-content, button, [class*="toolbar"], [class*="action"], [class*="copy"]').forEach(function (n) { n.remove(); });
      var raw = cleanAnswerText((clone.innerText || clone.textContent || '').trim());
      raw = raw.replace(/^思考已完成\s*/i, '');
      if (raw && raw.length > 2) return raw;
    }
    var clone2 = el.cloneNode(true);
    clone2.querySelectorAll('.chat-content-item-user, .user-content, button, [class*="toolbar"], [class*="action"], [class*="copy"]').forEach(function (n) { n.remove(); });
    var directText = cleanAnswerText((clone2.innerText || clone2.textContent || '').trim());
    directText = directText.replace(/^思考已完成\s*/i, '');
    if (directText && directText.length > 2) return directText;
    return null;
  }

  function readKimiAssistantAnswerText(root) {
    root = root || document.body;
    var items = root.querySelectorAll('div.chat-content-item-assistant');
    if (items.length) {
      var fromItem = extractKimiAssistantTextFromElement(items[items.length - 1]);
      if (fromItem) return fromItem;
    }
    var boxes = root.querySelectorAll('.segment-content-box');
    if (!boxes.length) {
      boxes = root.querySelectorAll('div.chat-content-item-assistant .segment-content-box');
    }
    if (!boxes.length) {
      boxes = root.querySelectorAll('div.chat-content-item-assistant [class*="markdown"], div.chat-content-item-assistant [class*="prose"], div.chat-content-item-assistant [class*="MessageContent"], div.chat-content-item-assistant [class*="message-content"]');
    }
    if (!boxes.length && root.matches && root.matches('.segment-content-box')) {
      boxes = [root];
    }
    if (!boxes.length) return null;
    var clone = boxes[boxes.length - 1].cloneNode(true);
    normalizeKimiKatexInClone(clone);
    clone.querySelectorAll('button, [class*="toolbar"], [class*="action"]').forEach(function (n) { n.remove(); });
    var raw = cleanAnswerText((clone.innerText || clone.textContent || '').trim());
    if (raw && raw.length > 2) return raw;
    return null;
  }

  function getDeepseekMessageScope() {
    return document.querySelector('main, [role="main"]') || document.body;
  }

  function readDeepseekAssistantAnswerText(root) {
    var scope = root && root !== document.body ? root : getDeepseekMessageScope();
    var all = scope.querySelectorAll('.ds-markdown');
    var last = null;
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.closest && el.closest('.ds-think-content')) continue;
      last = el;
    }
    if (!last) return null;
    var clone = last.cloneNode(true);
    clone.querySelectorAll('button, [class*="toolbar"], [class*="action"], [aria-label*="复制"], [aria-label*="点赞"], [aria-label*="踩"]').forEach(function (n) { n.remove(); });
    var raw = cleanAnswerText((clone.innerText || clone.textContent || '').trim());
    if (raw && raw.length > 2) return raw;
    return null;
  }

  function extractDeepseekAssistantFromMessageEl(el) {
    if (!el || !el.querySelectorAll) return null;
    var all = el.querySelectorAll('.ds-markdown');
    var last = null;
    for (var i = 0; i < all.length; i++) {
      if (all[i].closest && all[i].closest('.ds-think-content')) continue;
      last = all[i];
    }
    if (!last) return null;
    var clone = last.cloneNode(true);
    clone.querySelectorAll('button, [class*="toolbar"], [class*="action"], [aria-label*="复制"], [aria-label*="点赞"], [aria-label*="踩"]').forEach(function (n) { n.remove(); });
    var raw = cleanAnswerText((clone.innerText || clone.textContent || '').trim());
    if (raw && raw.length > 2) return raw;
    return null;
  }

  function setDeepseekPrompt(el, text) {
    if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && el.type === 'text')) {
      setInputValue(el, text);
    } else {
      setLexicalOrContentEditableInput(el, text);
    }
  }

  function readDeepseekInputPlainText() {
    var selectors = [
      'div.ds-scroll-area.ds-textarea textarea',
      '.ds-scroll-area.ds-textarea textarea',
      'textarea[placeholder*="消息"]',
      'textarea[placeholder*="问"]',
      'textarea[placeholder*="输入"]',
      'div[contenteditable="true"][role="textbox"]',
      '#root textarea',
      'textarea'
    ];
    for (var s = 0; s < selectors.length; s++) {
      var el = document.querySelector(selectors[s]);
      if (!el) continue;
      var raw = '';
      if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && el.type === 'text')) {
        raw = (el.value || '').trim();
      } else {
        raw = (el.innerText || el.textContent || '').trim();
      }
      var t = cleanAnswerText(raw);
      if (t) return t;
    }
    return '';
  }

  function domToMarkdown(element) {
    if (!element) return '';
    function escapeMarkdown(text) { return text.replace(/([\\`*~_#+\-|{}!])/g, '\\$1'); }
    function processNode(node) {
      if (!node) return '';
      if (node.nodeType === Node.TEXT_NODE) return escapeMarkdown(node.textContent);
      if (node.nodeType !== Node.ELEMENT_NODE) return '';
      var tag = node.tagName ? node.tagName.toLowerCase() : '';
      var className = node.className || '';
      var inner = Array.from(node.childNodes).map(processNode).join('');
      switch (tag) {
        case 'strong': case 'b': return '**' + inner + '**';
        case 'em': case 'i': return '*' + inner + '*';
        case 'code':
          if (node.parentElement && node.parentElement.tagName && node.parentElement.tagName.toLowerCase() === 'pre') return inner;
          return '`' + inner + '`';
        case 'pre':
          var codeEl = node.querySelector('code');
          var lang = '';
          if (codeEl) { var codeClass = codeEl.className || ''; var langMatch = codeClass.match(/language-(\w+)/); if (langMatch) lang = langMatch[1]; }
          var code = codeEl ? codeEl.textContent : node.textContent;
          return '```' + lang + '\n' + code.trim() + '\n```';
        case 'a': return '[' + (node.textContent || '') + '](' + (node.getAttribute('href') || '') + ')';
        case 'br': return '\n';
        case 'p': return inner + '\n\n';
        case 'div': return inner;
        case 'ul':
          var items = Array.from(node.querySelectorAll('li')).map(function (li) { return '- ' + li.textContent.trim(); }).join('\n');
          return items + '\n\n';
        case 'ol':
          var olItems = Array.from(node.querySelectorAll('li')).map(function (li, idx) { return (idx + 1) + '. ' + li.textContent.trim(); }).join('\n');
          return olItems + '\n\n';
        case 'li': return inner;
        case 'span': return inner;
        case 'img': return '![' + (node.getAttribute('alt') || 'image') + '](' + (node.getAttribute('src') || '') + ')';
        case 'table': return domToMarkdownTable(node);
        default: return inner;
      }
    }
    var result = '';
    for (var i = 0; i < element.childNodes.length; i++) result += processNode(element.childNodes[i]);
    return result.replace(/\n{3,}/g, '\n\n').trim();
  }

  function domToMarkdownTable(table) {
    var rows = table.querySelectorAll('tr');
    if (!rows.length) return '';
    var markdown = '';
    rows.forEach(function (row, rowIdx) {
      var cells;
      var isHeader = rowIdx === 0 && (row.querySelector('th') || row.parentElement.tagName.toLowerCase() === 'thead');
      if (isHeader) {
        cells = Array.from(row.querySelectorAll('th')).map(function (th) { return th.textContent.trim(); });
      } else {
        cells = Array.from(row.querySelectorAll('td')).map(function (td) { return td.textContent.trim(); });
      }
      markdown += cells.join(' | ') + '\n';
      if (isHeader) markdown += cells.map(function () { return '---'; }).join(' | ') + '\n';
    });
    return markdown + '\n';
  }

  function parseDomToMarkdown(element) {
    if (!element) return { markdown: '', raw: '' };
    var clone = element.cloneNode(true);
    var katexElements = clone.querySelectorAll('.katex');
    katexElements.forEach(function (katex) {
      var mathML = katex.querySelector('.katex-mathml');
      if (mathML) {
        var latex = mathML.getAttribute('alttext') || mathML.textContent;
        var replacement = katex.ownerDocument.createTextNode('$' + latex + '$');
        katex.parentNode.replaceChild(replacement, katex);
      } else {
        var html = katex.querySelector('.katex-html');
        if (html) {
          var span = katex.ownerDocument.createElement('span');
          span.textContent = html.textContent;
          katex.parentNode.replaceChild(span, katex);
        }
      }
    });
    var markdown = domToMarkdown(clone);
    var raw = cleanAnswerText((clone.textContent || '').trim());
    return { markdown: markdown, raw: raw };
  }

  // ==================== 发送问题相关（保留原有功能） ====================

  function waitFor(selector, root, timeout) {
    root = root || document;
    timeout = timeout || 15000;
    const el = root.querySelector(selector);
    if (el) return Promise.resolve(el);
    return new Promise((resolve, reject) => {
      const end = Date.now() + timeout;
      const t = setInterval(() => {
        const found = root.querySelector(selector);
        if (found) { clearInterval(t); resolve(found); return; }
        if (Date.now() > end) { clearInterval(t); reject(new Error('等待元素超时: ' + selector)); }
      }, 200);
    });
  }

  function setInputValue(el, text) {
    el.focus();
    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') { el.value = text; }
    else { el.innerText = text; el.textContent = text; }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function setLexicalOrContentEditableInput(el, text) {
    el.focus();
    try {
      document.execCommand('selectAll', false, null);
      document.execCommand('delete', false, null);
      var inserted = document.execCommand('insertText', false, text);
      if (!inserted || el.innerText === '') {
        el.innerText = text;
        el.textContent = text;
      }
    } catch (e) {
      try {
        el.innerText = text;
        el.textContent = text;
      } catch (e2) {}
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function sendRuntimeMessageSafe(message) {
    try {
      if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) return;
      chrome.runtime.sendMessage(message, function () { void chrome.runtime.lastError; });
    } catch (e) {}
  }

  function countMatchingNodes(root, selector, answerNodeFilter) {
    var nl = root.querySelectorAll(selector);
    if (!answerNodeFilter) return nl.length;
    var c = 0;
    for (var i = 0; i < nl.length; i++) {
      if (answerNodeFilter(nl[i])) c++;
    }
    return c;
  }

  function captureNewAnswer(containerSelector, timeoutMs, options) {
    options = options || {};
    var initialCount = options.initialCount != null ? options.initialCount : 0;
    var readTextFn = typeof options.readText === 'function' ? options.readText : null;
    var answerNodeFilter = typeof options.answerNodeFilter === 'function' ? options.answerNodeFilter : null;
    return new Promise((resolve) => {
      const start = Date.now();
      let lastText = '';
      const root = document.body;
      function snapshot() {
        const nodesLen = countMatchingNodes(root, containerSelector, answerNodeFilter);
        if (nodesLen <= initialCount) return { nodesLen: nodesLen, text: '' };
        if (readTextFn) {
          try { var tr = readTextFn(); var tRead = tr ? cleanAnswerText(String(tr).trim()) : ''; return { nodesLen: nodesLen, text: tRead || '' }; } catch (e) { return { nodesLen: nodesLen, text: '' }; }
        }
        const nodes = root.querySelectorAll(containerSelector);
        const texts = [];
        nodes.forEach(function (n) {
          if (answerNodeFilter && !answerNodeFilter(n)) return;
          const t = cleanAnswerText((n.innerText || n.textContent || '').trim());
          if (t) texts.push(t);
        });
        return { nodesLen: nodesLen, text: texts.length ? texts[texts.length - 1] : '' };
      }
      const observer = new MutationObserver(function () {
        const snap = snapshot();
        if (snap.nodesLen <= initialCount) return;
        var latest = snap.text;
        if (latest && latest !== lastText && latest.length > lastText.length) lastText = latest;
      });
      observer.observe(root, { childList: true, subtree: true });
      const checkDone = setInterval(function () {
        if (Date.now() - start > timeoutMs) { clearInterval(checkDone); observer.disconnect(); resolve(lastText || '[未检测到新回答]'); return; }
        const snap = snapshot();
        if (snap.nodesLen > initialCount) {
          if (snap.text && snap.text.length > 10) { lastText = snap.text; clearInterval(checkDone); observer.disconnect(); resolve(lastText); return; }
          if (snap.text && snap.text.length > lastText.length) lastText = snap.text;
        }
      }, 500);
    });
  }

  function streamResultFromCaptureAnswer(answer) {
    var s = answer == null ? '' : String(answer);
    if (s.indexOf('[未检测到新回答]') === 0) {
      return { status: 'timeout', answer: null, error: '等待回答超时或未检测到新回答' };
    }
    return { status: 'success', answer: s, error: null };
  }

  // ==================== 对话自动捕获系统 v2 - MutationObserver 优化版 ====================

  var ConversationObserver = {
    _observer: null,
    _conversationId: null,
    _id: null,
    _knownMessages: new Set(),
    _knownAssistantCount: 0,
    _lastAssistantText: '',
    _isObserving: false,
    _debounceTimer: null,
    _quietTimer: null,
    _urlPollTimer: null,
    _lastUrl: '',
    _MAX_KNOWN_MESSAGES: 1000,
    _lastVisibleScanTime: 0,
    _observerPaused: false,
    _observeTarget: null,
    _lastPollState: null,
    _pollSkipCount: 0,
    _lastSendButtonVisible: false,
    _lastStoredMessageCount: 0,
    _deepseekComposerCaptureInstalled: false,
    _pendingComposerUserText: null,
    _captureDelayAfterSendButtonMs: 500,
    
    // ====== 新增：Observer 优化相关状态 ======
    _observeMode: 'body',        // 'container' 或 'body'
    _containerRetryTimer: null,  // 容器定位重试定时器
    _containerRetryCount: 0,     // 重试次数
    _MAX_CONTAINER_RETRY: 6,     // 最大重试次数
    _CONTAINER_RETRY_INTERVAL: 5000, // 重试间隔(ms)

    /**
     * 尚无 conversationId 时轮询直到 URL 出现正式 ID
     */
    _bootstrapUntilConversationId: function () {
      var self = this;
      if (this._urlPollTimer) return;
      var tick = function () {
        var cid = getCurrentConversationId();
        if (!cid) return;
        try {
          chrome.runtime.sendMessage({
            type: 'REGISTER_TAB',
            siteId: siteId,
            url: window.location.href,
            title: document.title,
            conversationId: cid
          }, function (response) {
            if (chrome.runtime.lastError || !response || !response.ok || !response.hasConversationId || !response.id) return;
            if (self._urlPollTimer) {
              clearInterval(self._urlPollTimer);
              self._urlPollTimer = null;
            }
            ConversationObserver.init(response.conversationId, response.id);
          });
        } catch (e) {
          console.warn('[PolyChat] bootstrap 注册异常:', e);
        }
      };
      tick();
      this._urlPollTimer = setInterval(tick, 500);
    },

    /**
     * DeepSeek 使用虚拟列表，用户气泡在滚动或回复完成后常从 DOM 卸载
     */
    _installDeepseekComposerCapture: function () {
      if (this._deepseekComposerCaptureInstalled) return;
      this._deepseekComposerCaptureInstalled = true;
      var self = this;

      function isInChatRoot(node) {
        var r = document.getElementById('root');
        return !!(r && node && node.closest && r.contains(node));
      }

      function isDeepseekSendActivator(target) {
        if (!target || !target.closest || !isInChatRoot(target)) return false;
        if (target.closest('button[type="submit"]')) return true;
        if (target.closest('button[aria-label*="发送"], button[aria-label*="Send"], button[aria-label*="send"]')) return true;
        if (target.closest('div[role="button"][aria-label*="发送"], div[role="button"][aria-label*="Send"]')) return true;
        return false;
      }

      function isComposerTextarea(el) {
        if (!el || el.tagName !== 'TEXTAREA' || !el.closest) return false;
        if (!isInChatRoot(el)) return false;
        return !!el.closest('div.ds-scroll-area.ds-textarea, .ds-scroll-area.ds-textarea');
      }

      function captureOnceFromComposer() {
        if (!self._isObserving || !self._id || siteId !== 'deepseek') return;
        var text = readDeepseekInputPlainText();
        if (!text || text.length < 1) return;
        console.log('[PolyChat] DeepSeek 从输入框记下用户文案:', text.slice(0, 80));
        self._pendingComposerUserText = text;
      }

      document.addEventListener('click', function (ev) {
        if (siteId !== 'deepseek') return;
        if (!isDeepseekSendActivator(ev.target)) return;
        captureOnceFromComposer();
      }, true);

      document.addEventListener('keydown', function (ev) {
        if (siteId !== 'deepseek') return;
        if (ev.key !== 'Enter' || ev.shiftKey || ev.ctrlKey || ev.altKey || ev.metaKey) return;
        if (!isComposerTextarea(ev.target)) return;
        captureOnceFromComposer();
      }, true);
    },

    // ==================== 新增：增强的消息容器定位 ====================

    /**
     * 查找消息容器 - 策略1：直接选择器匹配
     */
    _findContainerBySelectors: function () {
      var config = this._siteConfig[siteId];
      if (!config || !config.messageContainerSelectors) return null;

      var selectors = config.messageContainerSelectors[siteId] || [];
      
      console.log('[PolyChat] 尝试', selectors.length, '个选择器查找消息容器');
      
      for (var i = 0; i < selectors.length; i++) {
        try {
          var el = document.querySelector(selectors[i]);
          if (el) {
            console.log('[PolyChat] 通过选择器找到消息容器:', selectors[i], '元素:', el.tagName, el.className ? el.className.slice(0, 50) : '');
            return el;
          } else {
            console.log('[PolyChat] 选择器未匹配:', selectors[i]);
          }
        } catch (e) {
          console.log('[PolyChat] 选择器错误:', selectors[i], e.message);
          continue;
        }
      }
      console.log('[PolyChat] 所有选择器均未找到消息容器');
      return null;
    },

    /**
     * 查找消息容器 - 策略2：通过消息元素推导
     */
    _findContainerByMessages: function () {
      var config = this._siteConfig[siteId];
      
      // 通用消息选择器（作为 fallback）
      var genericSelectors = [
        '[class*="message"]',              // 通用消息类
        '[data-testid*="message"]',        // data-testid 包含 message
        '[class*="chat-item"]',            // 聊天项
        '[class*="conversation-item"]',    // 对话项
        '[class*="bubble"]',               // 气泡消息
        '[class*="msg-item"]',             // 消息项
      ];
      
      var allMessageEls = [];
      
      // 首先尝试通用选择器
      for (var g = 0; g < genericSelectors.length; g++) {
        try {
          var gels = document.querySelectorAll(genericSelectors[g]);
          if (gels.length > 0) {
            // 过滤掉侧边栏中的元素
            var filtered = Array.from(gels).filter(function(el) {
              // 排除侧边栏中的元素
              var inSidebar = el.closest('#flow_chat_sidebar, [class*="sidebar"], [class*="left-side"]');
              return !inSidebar;
            });
            if (filtered.length > 0) {
              allMessageEls = filtered;
              console.log('[PolyChat] 通过通用选择器找到消息元素:', genericSelectors[g], '数量:', filtered.length);
              break;
            }
          }
        } catch (e) {
          continue;
        }
      }
      
      // 如果通用选择器没找到，尝试配置的选择器
      if (allMessageEls.length === 0 && config) {
        var assistantSelectors = config.assistantSelectors || [config.assistantSelector];
        var userSelectors = config.userSelectors || [config.userSelector];
        
        // 收集助手消息元素
        for (var i = 0; i < assistantSelectors.length; i++) {
          try {
            var els = document.querySelectorAll(assistantSelectors[i]);
            if (els.length > 0) {
              allMessageEls = allMessageEls.concat(Array.from(els));
              break;
            }
          } catch (e) {
            continue;
          }
        }
        
        // 如果没有助手消息，尝试用户消息
        if (allMessageEls.length === 0) {
          for (var j = 0; j < userSelectors.length; j++) {
            try {
              var uels = document.querySelectorAll(userSelectors[j]);
              if (uels.length > 0) {
                allMessageEls = allMessageEls.concat(Array.from(uels));
                break;
              }
            } catch (e) {
              continue;
            }
          }
        }
      }
      
      if (allMessageEls.length === 0) return null;

      // 找到包含最多消息元素的父容器
      var parentMap = new Map();
      
      for (var k = 0; k < allMessageEls.length; k++) {
        var msgEl = allMessageEls[k];
        var parent = msgEl.parentElement;
        var depth = 0;
        
        // 向上遍历最多5层
        while (parent && depth < 5) {
          var count = parentMap.get(parent) || 0;
          parentMap.set(parent, count + 1);
          parent = parent.parentElement;
          depth++;
        }
      }
      
      // 找到包含最多消息元素的父容器
      var bestParent = null;
      var maxCount = 0;
      
      for (var [p, c] of parentMap.entries()) {
        if (c > maxCount) {
          maxCount = c;
          bestParent = p;
        }
      }
      
      // 验证：找到的容器应该包含大部分消息元素
      // 放宽条件：只要包含至少3个消息元素，或者包含最多消息元素的20%
      if (bestParent && (maxCount >= 3 || maxCount >= allMessageEls.length * 0.2)) {
        console.log('[PolyChat] 通过消息元素推导找到容器，包含', maxCount, '个消息元素，总共', allMessageEls.length, '个');
        return bestParent;
      }
      
      // 如果找不到合适的容器，但至少有一些消息元素，返回第一个消息元素的父元素
      if (allMessageEls.length > 0 && allMessageEls[0].parentElement) {
        console.log('[PolyChat] 使用第一个消息元素的父元素作为容器');
        return allMessageEls[0].parentElement;
      }
      
      return null;
    },

    /**
     * 验证容器是否有效
     */
    _validateContainer: function (container) {
      if (!container) return false;
      
      // 检查容器是否在 DOM 中
      if (!document.contains(container)) return false;
      
      // 检查容器是否可见
      var style = window.getComputedStyle(container);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      
      // 对于 main 元素或 #chat-route-layout main，直接认为是有效的
      // 因为这些是页面主内容区，消息一定在里面
      if (container.tagName === 'MAIN' || 
          container.id === 'chat-route-layout' ||
          container.matches && container.matches('#chat-route-layout main')) {
        return true;
      }
      
      var config = this._siteConfig[siteId];
      if (!config) return true; // 无配置时跳过消息检查
      
      // 检查容器内是否包含消息元素（使用配置的选择器）
      var assistantSelectors = config.assistantSelectors || [config.assistantSelector];
      var userSelectors = config.userSelectors || [config.userSelector];
      
      // 合并所有选择器
      var allSelectors = assistantSelectors.concat(userSelectors);
      
      for (var i = 0; i < allSelectors.length; i++) {
        try {
          var msgs = container.querySelectorAll(allSelectors[i]);
          if (msgs.length > 0) {
            return true;
          }
        } catch (e) {
          continue;
        }
      }
      
      // 使用通用选择器再次检查
      var genericSelectors = [
        '[class*="message"]',
        '[class*="chat-item"]',
        '[class*="bubble"]',
        '[data-testid*="message"]'
      ];
      
      for (var j = 0; j < genericSelectors.length; j++) {
        try {
          var genericMsgs = container.querySelectorAll(genericSelectors[j]);
          if (genericMsgs.length > 0) {
            return true;
          }
        } catch (e) {
          continue;
        }
      }
      
      // 如果容器是主内容区，即使没有找到消息元素，也认为是有效的
      // 因为消息可能还没有加载
      if (container.tagName === 'MAIN' || container.matches && container.matches('main')) {
        return true;
      }
      
      return false;
    },

    /**
     * 增强的消息容器定位（综合策略）
     */
    _findObserveTarget: function () {
      console.log('[PolyChat] 开始查找消息容器，siteId:', siteId);
      
      // 策略1：直接选择器匹配
      console.log('[PolyChat] 策略1: 直接选择器匹配');
      var container = this._findContainerBySelectors();
      if (container) {
        console.log('[PolyChat] 选择器找到容器，开始验证');
        if (this._validateContainer(container)) {
          console.log('[PolyChat] 容器验证通过');
          this._observeMode = 'container';
          return container;
        } else {
          console.log('[PolyChat] 容器验证失败');
        }
      } else {
        console.log('[PolyChat] 选择器未找到容器');
      }
      
      // 策略2：通过消息元素推导
      console.log('[PolyChat] 策略2: 通过消息元素推导');
      container = this._findContainerByMessages();
      if (container) {
        console.log('[PolyChat] 消息推导找到容器，开始验证');
        if (this._validateContainer(container)) {
          console.log('[PolyChat] 容器验证通过');
          this._observeMode = 'container';
          return container;
        } else {
          console.log('[PolyChat] 容器验证失败');
        }
      } else {
        console.log('[PolyChat] 消息推导未找到容器');
      }
      
      // 降级：使用 body
      console.log('[PolyChat] 未找到消息容器，降级到 body 观察');
      this._observeMode = 'body';
      return document.body;
    },

    /**
     * 启动容器定位重试机制
     */
    _startContainerRetry: function () {
      if (this._containerRetryTimer) return;
      if (this._containerRetryCount >= this._MAX_CONTAINER_RETRY) return;
      
      var self = this;
      this._containerRetryTimer = setTimeout(function () {
        self._containerRetryTimer = null;
        self._containerRetryCount++;
        
        // 尝试重新定位容器
        var container = self._findObserveTarget();
        if (self._observeMode === 'container') {
          console.log('[PolyChat] 重试成功，切换到容器观察模式');
          self._restartObserver(container);
        } else {
          // 继续重试
          self._startContainerRetry();
        }
      }, this._CONTAINER_RETRY_INTERVAL);
    },

    /**
     * 重启 Observer
     */
    _restartObserver: function (target) {
      if (this._observer) {
        this._observer.disconnect();
      }
      
      this._observeTarget = target;
      this._observer = new MutationObserver(() => {
        this._onMutation();
      });
      
      // 根据观察模式使用不同配置
      var config = this._getObserverConfig();
      this._observer.observe(target, config);
      
      console.log('[PolyChat] Observer 重启，模式:', this._observeMode, '目标:', target === document.body ? 'body' : 'container');
    },

    /**
     * 获取 Observer 配置
     */
    _getObserverConfig: function () {
      if (this._observeMode === 'container') {
        // 容器模式：只监听直接子元素变化
        return {
          childList: true,
          subtree: false,        // 不监听子树
          characterData: false,  // 不监听文本变化
          attributes: false      // 不监听属性变化
        };
      } else {
        // Body 模式：完整监听（降级）
        return {
          childList: true,
          subtree: true,         // 必须监听子树
          characterData: true,   // 监听文本变化
          attributes: false
        };
      }
    },

    // ==================== 站点特定配置 ====================
    _siteConfig: {
      // 消息容器选择器（用于缩小 MutationObserver 观察范围）
      messageContainerSelectors: {
        doubao: [
          // 基于结构的选择器（优先级高）
          // 豆包页面结构: #chat-route-layout > .main-with-nav-xxx > nav + main
          '#chat-route-layout > div > main',     // 精确路径（豆包特定）
          '#chat-route-layout main',             // 后代选择器
          '[class*="main-with-nav"] > main',    // 模糊匹配主内容区
          '[class*="main-with-nav"] main',      // 后代选择器
          'main[data-container-name="main"]',    // data-container-name 属性
          'main[role="main"]',                   // ARIA 角色
          'main',                                // 主元素（最后的 fallback）
          
          // 基于类名的选择器（豆包常用类名）
          '[class*="message-list"]',             // 通用消息列表
          '[class*="chat-list"]',                // 聊天列表
          '[class*="chat-item"]',                // 聊天项
          '[data-testid="message-list"]',        // data-testid
          '[class*="conversation-container"]',   // 对话容器
          
          // 滚动容器（限定在主内容区内）
          'main .overflow-y-auto',                // 主内容区内的滚动容器
          '[class*="main-with-nav"] .overflow-y-auto', // 主内容区滚动容器
        ],
        yuanbao: [
          '.agent-chat__list',                 // 元宝消息列表
          '[class*="chat-list"]',              // 通用聊天列表
          '[class*="message-list"]',           // 通用消息列表
          '.agent-chat__content',              // 聊天内容区
        ],
        kimi: [
          '.chat-content-list',                // Kimi 消息列表
          '#chat-box .chat-content',           // 聊天框内容
          '[class*="chat-content-list"]',      // 通用内容列表
          '.overflow-auto',                    // 自动滚动容器
        ],
        deepseek: [
          'main[role="main"]',                 // 主内容区
          'div.ds-chat-container',             // DeepSeek 聊天容器
          '[class*="chat-container"]',         // 通用聊天容器
          '.overflow-y-auto',                  // 垂直滚动容器
        ],
        gemini: [
          '.conversation-container',           // Gemini 对话容器
          'div[class*="conversation"]',        // 通用对话容器
          '[class*="chat-container"]',         // 通用聊天容器
          'main',                              // 主区域
        ],
        grok: [
          '.chat-container',                   // Grok 聊天容器
          'div[class*="chat-list"]',           // 通用聊天列表
          '[class*="message-list"]',           // 通用消息列表
          '.overflow-y-auto',                  // 滚动容器
        ],
        yiyan: [
          '.dialogCardList',                   // 文心一言对话卡片列表
          'div[class*="dialogList"]',          // 对话列表
          '[class*="chat-list"]',              // 通用聊天列表
          '.overflow-auto',                    // 自动滚动容器
        ],
      },
      // 统一发送按钮选择器
      sendButtonSelectors: {
        doubao: [
          'button[type="submit"]',
          'button[aria-label*="发送"]',
          '[class*="send"] button',
          '[data-testid="send_message"]',
          'button[data-testid*="send"]',
          'div.message-item.user button'
        ],
        yuanbao: [
          'a#yuanbao-send-btn',
          'button:has(svg[data-icon*="send"])',
          '[class*="send-btn"]',
          'button[class*="send"]'
        ],
        kimi: [
          'div.send-button-container:not(.disabled)',
          'div.send-button-container',
          'button.send-button',
          '[class*="send-button"]'
        ],
        deepseek: [
          'button[aria-label*="发送"], button:has(svg), [class*="send"], button[type="button"]',
          'div[role="button"][aria-label*="发送"]',
          'button svg ~ span'
        ],
        gemini: [
          'button[aria-label*="Send"]',
          'button[aria-label*="发送"]',
          'button[data-test-id="send-button"]',
          'button:has(svg)',
          '[class*="send-button"]',
          'button[type="submit"]'
        ],
        grok: [
          'button[aria-label="Send message"]',
          'button[aria-label="发送消息"]',
          'button[aria-label="Send"].send-button',
          'button[aria-label="发送"].send-button',
          '.chat-input-container button',
          '.message-input-container button',
          'button.send-button:not([aria-label*="展开"]):not([aria-label*="收起"])',
          'button.submit-button:not([aria-label*="展开"]):not([aria-label*="收起"])',
          'button[type="submit"]:not([aria-label*="展开"]):not([aria-label*="收起"])',
          'button:has(svg[aria-label="Send"])',
          'button:has(svg[aria-label="发送"])',
          'button:has(svg)[class*="send"]'
        ],
        yiyan: [
          'div[class*="send"] button',
          'button[class*="send"]',
          'div[class*="sendInner"]',
          'button[aria-label*="发送"]',
          'button[type="submit"]',
          '.inputToolbarRight button',
          'div[class*="btnContainer"] button'
        ]
      },
      doubao: {
        userSelectors: [
          '[class*="bg-g-send-msg-bubble"]',
          '[class*="send-msg-bubble"]',
          '[class*="justify-end"]',
          '[data-testid="union_message"] [data-testid="send_message"]',
          '[data-testid*="send_message"]',
          '.content-Xv_Zw0 > div:first-child',
          'div[role="user"], div[data-role="user"]'
        ],
        userSelector: '[class*="bg-g-send-msg-bubble"]',
        getUserText: function (el) {
          if (!isDoubaoLikelyUserBubble(el)) return null;
          var bubble = el.querySelector('[class*="bg-g-send-msg-bubble"]');
          if (bubble) return cleanAnswerText((bubble.innerText || bubble.textContent || '').trim());
          return cleanAnswerText((el.innerText || el.textContent || '').trim());
        },
        assistantSelectors: [
          '[data-target-id="message-box-target-id"]',
          '[class*="inner-item-"]',
          '.container-PvPoAn',
          'div.message-item.assistant',
          '[data-testid="union_message"]',
        ],
        assistantSelector: '[data-target-id="message-box-target-id"]',
        getAssistantText: function (el) {
          if (isDoubaoLikelyUserBubble(el)) return null;
          var userBubble = el.querySelector('[class*="bg-g-send-msg-bubble"]');
          if (userBubble) return null;
          if (el.classList && el.classList.contains('assistant') && el.classList.contains('message-item')) {
            var raw = stripDoubaoFooter(cleanAnswerText((el.innerText || el.textContent || '').trim()));
            if (raw && raw.length > 2) return raw;
          }
          var block = el.querySelector('[data-testid="message-block-container"]');
          if (block) {
            for (var c = block.firstElementChild; c; c = c.nextElementSibling) {
              if (c.getAttribute && c.getAttribute('data-testid') === 'send_message') return null;
            }
            var raw = stripDoubaoFooter(cleanAnswerText((block.innerText || block.textContent || '').trim()));
            if (raw && raw.length > 2) return raw;
          }
          var directText = stripDoubaoFooter(cleanAnswerText((el.innerText || el.textContent || '').trim()));
          if (directText && directText.length > 2) return directText;
          return null;
        },
      },
      yuanbao: {
        userSelectors: [
          '.agent-chat__list__item--user[data-conv-speaker="user"]',
          '.agent-chat__list__item--user',
          '[data-conv-speaker="user"]',
          '.agent-chat__list__item:not(.agent-chat__list__item--ai)',
        ],
        userSelector: '.agent-chat__list__item--user[data-conv-speaker="user"]',
        getUserText: function (el) {
          var bubble = el.querySelector('.agent-chat__conv--user__bubble');
          if (bubble) return cleanAnswerText(bubble.innerText.trim());
          return cleanAnswerText((el.innerText || el.textContent || '').trim());
        },
        assistantSelectors: [
          '.agent-chat__list__item--ai[data-conv-speaker="ai"]',
          '.agent-chat__list__item--ai',
          '[data-conv-speaker="ai"]',
        ],
        assistantSelector: '.agent-chat__list__item--ai[data-conv-speaker="ai"]',
        getAssistantText: function (el) {
          var clone = el.cloneNode(true);
          clone.querySelectorAll('.agent-chat__conv--ai__toolbar').forEach(function (tb) { tb.remove(); });
          var raw = cleanAnswerText((clone.innerText || clone.textContent || '').trim());
          if (raw && raw.length > 2) return raw;
          return null;
        },
      },
      kimi: {
        userSelectors: [
          'div.chat-content-item-user',
          '[data-testid="user-message"]',
          '[class*="chat-content"][class*="user"]',
        ],
        userSelector: 'div.chat-content-item-user',
        getUserText: function (el) {
          var text = cleanAnswerText((el.innerText || el.textContent || '').trim());
          if (!text || text.length < 2) return null;
          return text;
        },
        assistantSelectors: [
          '[data-testid="assistant-message"]',
          'div.chat-content-item-assistant',
          'div[class*="chat-content-item"][class*="assistant"]',
          '[class*="ChatContentItem"][class*="assistant"]',
          '[class*="chat-content"][class*="assistant"]',
        ],
        assistantSelector: 'div.chat-content-item-assistant',
        getAssistantText: function (el) {
          return extractKimiAssistantTextFromElement(el);
        },
      },
      deepseek: {
        userSelectors: [
          'div.ds-message:not(:has(.ds-markdown)):not(:has(.ds-think-content))',
          'div.ds-message:not(:has(.ds-markdown))',
        ],
        userSelector: 'div.ds-message:not(:has(.ds-markdown)):not(:has(.ds-think-content))',
        getUserText: function (el) {
          if (el.querySelector && (el.querySelector('.ds-markdown') || el.querySelector('.ds-think-content'))) return null;
          var t = cleanAnswerText((el.innerText || el.textContent || '').trim());
          if (!t || t.length < 1) return null;
          return t;
        },
        assistantSelectors: [
          'div.ds-message:has(.ds-markdown)',
          'div.ds-message:has(.ds-think-content)',
        ],
        assistantSelector: 'div.ds-message:has(.ds-markdown)',
        getAssistantText: function (el) {
          return extractDeepseekAssistantFromMessageEl(el);
        },
      },
      gemini: {
        userSelectors: [
          'user-query',
          '[data-test-id="user-query"]',
          'div[class*="user-query"]',
          'div[class*="user-message"]',
          '[role="presentation"] div:first-child',
          '.query-content',
        ],
        userSelector: 'user-query',
        getUserText: function (el) {
          var textEl = el.querySelector('.query-text, .user-query-text, [class*="query-content"]') || el;
          var t = cleanAnswerText((textEl.innerText || textEl.textContent || '').trim());
          if (!t || t.length < 1) return null;
          t = t.replace(/^(你说|You said)[\s:,]*/i, '');
          if (!t || t.length < 1) return null;
          return t;
        },
        assistantSelectors: [
          'model-response',
          '[data-test-id="model-response"]',
          'div[class*="model-response"]',
          'div[class*="response-content"]',
          'message-content',
        ],
        assistantSelector: 'model-response',
        getAssistantText: function (el) {
          var mdEl = el.querySelector('.markdown, [class*="markdown"], .response-text, [class*="message-content"]') || el;
          var clone = mdEl.cloneNode(true);
          clone.querySelectorAll('button, [class*="toolbar"], [class*="action"], [class*="copy"]').forEach(function (n) { n.remove(); });
          var raw = cleanAnswerText((clone.innerText || clone.textContent || '').trim());
          if (raw && raw.length > 2) return raw;
          return null;
        },
      },
      grok: {
        userSelectors: [
          'div.message-bubble.bg-surface-l1',
          'div.message-bubble.border-border-l1',
        ],
        userSelector: 'div.message-bubble.bg-surface-l1',
        getUserText: function (el) {
          var textEl = el.querySelector('.response-content-markdown p, p[style*="white-space: pre-wrap"]') || el;
          var t = cleanAnswerText((textEl.innerText || textEl.textContent || '').trim());
          if (!t || t.length < 1) return null;
          return t;
        },
        assistantSelectors: [
          'div.message-bubble.w-full.max-w-none',
          'div.message-bubble.max-w-none',
        ],
        assistantSelector: 'div.message-bubble.w-full.max-w-none',
        getAssistantText: function (el) {
          var textEl = el.querySelector('.response-content-markdown') || el;
          var clone = textEl.cloneNode(true);
          clone.querySelectorAll('button, [class*="toolbar"], [class*="action"], [class*="copy"], .citation').forEach(function (n) { n.remove(); });
          var raw = cleanAnswerText((clone.innerText || clone.textContent || '').trim());
          if (raw && raw.length > 2) return raw;
          return null;
        },
      },
      yiyan: {
        userSelectors: [
          'div[class*="questionBox"]',
          '[id="question_text_id"]',
          'div[class*="questionText"]',
        ],
        userSelector: 'div[class*="questionBox"]',
        getUserText: function (el) {
          var textEl = el.querySelector('[id="question_text_id"], [class*="questionText"]') || el;
          var t = cleanAnswerText((textEl.innerText || textEl.textContent || '').trim());
          if (!t || t.length < 1) return null;
          return t;
        },
        assistantSelectors: [
          'div[class*="answerBox"]',
          '[id="answer_text_id"]',
          'div[class*="custom-html"]',
        ],
        assistantSelector: 'div[class*="answerBox"]',
        getAssistantText: function (el) {
          var textEl = el.querySelector('[id="answer_text_id"], [class*="custom-html"]') || el;
          var clone = textEl.cloneNode(true);
          clone.querySelectorAll('button, [class*="toolbar"], [class*="action"], [class*="copy"], [class*="dialogCardBottom"]').forEach(function (n) { n.remove(); });
          var raw = cleanAnswerText((clone.innerText || clone.textContent || '').trim());
          if (raw && raw.length > 2) return raw;
          return null;
        },
      },
    },

    /**
     * 初始化观察器 - 优化版
     */
    init: function (conversationId, id) {
      if (!siteId || this._isObserving) return;
      if (!conversationId || !id) {
        console.log('[PolyChat] 无conversationId，跳过Observer启动（新对话页面）');
        return;
      }

      this._conversationId = conversationId;
      this._id = id;
      this._isObserving = true;
      this._observerPaused = false;
      this._knownMessages.clear();
      this._knownAssistantCount = 0;
      this._lastAssistantText = '';
      this._lastUrl = window.location.href;
      
      // 重置容器定位状态
      this._observeMode = 'body';
      this._containerRetryCount = 0;
      if (this._containerRetryTimer) {
        clearTimeout(this._containerRetryTimer);
        this._containerRetryTimer = null;
      }

      console.log('[PolyChat] Observer启动，conversationId:', conversationId, 'id:', id);

      // 初始扫描已有对话
      this._scanExistingConversations();

      // 查找消息容器并启动 MutationObserver
      var observeTarget = this._findObserveTarget();
      this._observeTarget = observeTarget;
      
      this._observer = new MutationObserver(() => {
        this._onMutation();
      });
      
      // 根据观察模式使用不同配置
      var observerConfig = this._getObserverConfig();
      this._observer.observe(observeTarget, observerConfig);
      
      console.log('[PolyChat] MutationObserver 已启动，模式:', this._observeMode);
      
      // 如果是 body 模式，启动重试机制
      if (this._observeMode === 'body') {
        this._startContainerRetry();
      }

      // 启动URL轮询
      this._startUrlPolling();

      // 监听页面可见性变化
      this._startVisibilityWatcher();

      if (siteId === 'deepseek') {
        this._installDeepseekComposerCapture();
      }

      // 初始检查发送按钮状态
      setTimeout(() => {
        this._checkSendButtonState();
      }, 1500);
    },

    /**
     * 启动URL轮询
     */
    _startUrlPolling: function () {
      if (this._urlPollTimer) return;

      this._urlPollTimer = setInterval(() => {
        try {
          const currentUrl = window.location.href;
          if (currentUrl !== this._lastUrl) {
            const newConvId = getCurrentConversationId();
            if (newConvId && newConvId !== this._conversationId) {
              console.log('[PolyChat] 检测到新对话创建');
              this._notifyNewConversation(newConvId, currentUrl);
            }
            this._lastUrl = currentUrl;
          }
        } catch (e) {
          console.warn('[PolyChat] URL轮询异常:', e.message);
          clearInterval(this._urlPollTimer);
          this._urlPollTimer = null;
          this._isObserving = false;
        }
      }, 3000);
    },

    /**
     * 监听页面可见性变化
     */
    _startVisibilityWatcher: function () {
      var self = this;
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden && self._isObserving) {
          if (self._observerPaused) {
            self._observerPaused = false;
            if (self._observer && self._observeTarget) {
              var config = self._getObserverConfig();
              self._observer.observe(self._observeTarget, config);
              console.log('[PolyChat] Observer 已恢复');
            }
          }
          self._checkSendButtonState();
          
          var now = Date.now();
          if (now - self._lastVisibleScanTime < 10000) return;
          self._lastVisibleScanTime = now;
          console.log('[PolyChat] 页面变为可见，触发全量扫描');
          setTimeout(function () {
            self._rescanAndSync();
          }, 500);
        } else if (document.hidden && self._isObserving && !self._observerPaused) {
          self._observerPaused = true;
          if (self._observer) {
            self._observer.disconnect();
            console.log('[PolyChat] Observer 已暂停（Tab隐藏）');
          }
        }
      });
    },

    /**
     * 重新扫描
     */
    _rescanAndSync: function () {
      this._forceFullCapture();
    },

    /**
     * 通知后台新对话
     */
    _notifyNewConversation: function (newConvId, newUrl) {
      var prevConvId = this._conversationId;
      var prevS = prevConvId != null ? String(prevConvId) : '';
      var newS = newConvId != null ? String(newConvId) : '';
      var deletePrevPlaceholder =
        (siteId === 'doubao' && prevS && /^local_/i.test(prevS) && newS && !/^local_/i.test(newS)) ||
        (siteId === 'yuanbao' && prevS && prevS.indexOf('/') === -1 && newS && newS.indexOf('/') !== -1);
      
      try {
        chrome.runtime.sendMessage({
          type: 'REGISTER_TAB',
          siteId: siteId,
          url: newUrl,
          title: document.title,
          conversationId: newConvId
        }, (response) => {
          if (chrome.runtime.lastError || !response) return;

          if (response.ok && response.hasConversationId && response.id) {
            if (deletePrevPlaceholder) {
              try {
                chrome.runtime.sendMessage({
                  type: 'DELETE_CONVERSATION_BY_SITE_CONV',
                  siteId: siteId,
                  conversationId: prevS
                });
              } catch (e) {}
            }
            
            this._conversationId = newConvId;
            this._id = response.id;
            this._knownMessages.clear();
            this._knownAssistantCount = 0;
            this._lastAssistantText = '';
            this._pendingComposerUserText = null;
            
            // 重置容器定位
            this._containerRetryCount = 0;
            if (this._containerRetryTimer) {
              clearTimeout(this._containerRetryTimer);
              this._containerRetryTimer = null;
            }

            console.log('[PolyChat] 已切换到新会话', newConvId);

            // 重新定位容器
            var newTarget = this._findObserveTarget();
            if (newTarget !== this._observeTarget) {
              this._restartObserver(newTarget);
            }
            
            this._scanExistingConversations();
          }
        });
      } catch (e) {
        console.warn('[PolyChat] 通知新对话异常:', e.message);
      }
    },

    /**
     * 通用选择器方法
     */
    _querySelectorAll: function (config, type) {
      var selectors = config[type + 'Selectors'] || [config[type + 'Selector']];
      for (var i = 0; i < selectors.length; i++) {
        var els = document.querySelectorAll(selectors[i]);
        if (els.length > 0) {
          if (i === 0) {
            console.log('[PolyChat] 选择器健康检查:', type, '主选择器成功，匹配', els.length, '个元素');
          } else {
            console.log('[PolyChat] 选择器健康检查:', type, 'fallback 到第', (i+1), '级选择器');
          }
          return els;
        }
      }
      console.warn('[PolyChat] 选择器健康检查:', type, '所有选择器均未匹配');
      return [];
    },

    /**
     * 检查发送按钮状态
     */
    _checkSendButtonState: function () {
      if (!this._isObserving) return false;

      var selectors = this._siteConfig.sendButtonSelectors[siteId] || [];
      if (!selectors.length) return false;

      var hasSendButton = false;
      for (var i = 0; i < selectors.length; i++) {
        if (document.querySelector(selectors[i])) {
          hasSendButton = true;
          break;
        }
      }

      var wasVisible = this._lastSendButtonVisible;
      this._lastSendButtonVisible = hasSendButton;

      if (!wasVisible && hasSendButton) {
        console.log('[PolyChat] 发送按钮从不可见变为可见，触发同步');
        this._syncOnSendButtonAppear();
        return true;
      }
      return false;
    },

    /**
     * 发送按钮出现时同步
     */
    _syncOnSendButtonAppear: function () {
      if (!this._id || !this._isObserving) return;

      var config = this._siteConfig[siteId];
      if (!config) return;

      var self = this;
      var base = this._captureDelayAfterSendButtonMs || 500;
      var delays = (siteId === 'doubao' || siteId === 'kimi')
        ? [base, base + 2000, base + 5500]
        : [base];
      
      console.log('[PolyChat] 发送按钮恢复，将在 ms 后执行全量 CAPTURE:', delays.join(', '));
      for (var d = 0; d < delays.length; d++) {
        (function (ms) {
          setTimeout(function () {
            if (!self._isObserving || !self._id) return;
            self._forceFullCapture();
          }, ms);
        })(delays[d]);
      }
    },

    /**
     * 处理轮询请求
     */
    _handlePollRequest: function () {
      if (!this._isObserving) {
        return { hasChanges: false, messageCount: 0, contentHash: '' };
      }
      
      var config = this._siteConfig[siteId];
      if (!config) {
        return { hasChanges: false, messageCount: 0, contentHash: '' };
      }
      
      try {
        this._checkSendButtonState();

        var userEls = this._querySelectorAll(config, 'user');
        var assistantEls = this._querySelectorAll(config, 'assistant');
        var messageCount = userEls.length + assistantEls.length;
        
        var isFirstPoll = !this._lastPollState;
        var countChanged = isFirstPoll
          ? messageCount > 0
          : this._lastPollState.messageCount !== messageCount;
        
        var contentHash = '';
        if (!countChanged && messageCount > 0) {
          var lastUserEl = userEls.length > 0 ? userEls[userEls.length - 1] : null;
          var lastAssistantEl = assistantEls.length > 0 ? assistantEls[assistantEls.length - 1] : null;
          
          var lastUserText = lastUserEl ? (config.getUserText(lastUserEl) || '').slice(0, 100) : '';
          var lastAssistantText = lastAssistantEl ? (config.getAssistantText(lastAssistantEl) || '').slice(0, 100) : '';
          
          contentHash = this._quickHash(lastUserText + '|' + lastAssistantText);
        }
        
        var hashChanged = !isFirstPoll && this._lastPollState.contentHash !== contentHash;
        var hasChanges = isFirstPoll ? messageCount > 0 : (countChanged || hashChanged);
        
        this._lastPollState = {
          messageCount: messageCount,
          contentHash: contentHash,
          timestamp: Date.now()
        };
        
        if (hasChanges) {
          console.log('[PolyChat] 轮询检测到变化:', { countChanged, hashChanged, messageCount });
        }
        
        return { hasChanges, messageCount, contentHash };
        
      } catch (err) {
        console.error('[PolyChat] 轮询处理异常:', err);
        return { hasChanges: false, messageCount: 0, contentHash: '', error: err.message };
      }
    },
    
    /**
     * 快速哈希
     */
    _quickHash: function (str) {
      if (!str) return '';
      var hash = 5381;
      for (var i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
        hash = hash & hash;
      }
      return hash.toString(36);
    },

    /**
     * 停止观察
     */
    destroy: function () {
      this._observerPaused = false;
      if (this._observer) {
        this._observer.disconnect();
        this._observer = null;
      }
      if (this._debounceTimer) { clearTimeout(this._debounceTimer); this._debounceTimer = null; }
      if (this._quietTimer) { clearTimeout(this._quietTimer); this._quietTimer = null; }
      if (this._urlPollTimer) { clearInterval(this._urlPollTimer); this._urlPollTimer = null; }
      if (this._containerRetryTimer) { clearTimeout(this._containerRetryTimer); this._containerRetryTimer = null; }
      this._isObserving = false;
    },

    /**
     * 生成消息指纹
     */
    _fingerprint: function (role, text) {
      var s = (text || '').toString();
      var short = s.length > 200 ? s.slice(0, 100) + '...' + s.slice(-100) : s;
      return role + ':' + short;
    },

    /**
     * DeepSeek: 从消息节点提取稳定主键
     */
    _extractDeepseekMessageKey: function (el) {
      if (!el || siteId !== 'deepseek') return null;
      try {
        var keyedNode = null;
        if (el.closest) keyedNode = el.closest('[data-virtual-list-item-key]');
        if (!keyedNode && el.getAttribute && el.getAttribute('data-virtual-list-item-key')) keyedNode = el;
        if (!keyedNode || !keyedNode.getAttribute) return null;
        var key = (keyedNode.getAttribute('data-virtual-list-item-key') || '').trim();
        return key || null;
      } catch (_) {
        return null;
      }
    },

    /**
     * 安全添加指纹
     */
    _addFingerprint: function (fp) {
      if (this._knownMessages.size >= this._MAX_KNOWN_MESSAGES) {
        var arr = Array.from(this._knownMessages);
        this._knownMessages = new Set(arr.slice(Math.floor(arr.length / 2)));
      }
      this._knownMessages.add(fp);
    },

    /**
     * 初始扫描
     */
    _scanExistingConversations: function () {
      var config = this._siteConfig[siteId];
      if (!config) return;

      var userEls = this._querySelectorAll(config, 'user');
      var assistantEls = this._querySelectorAll(config, 'assistant');

      var allMessages = [];

      userEls.forEach(function (el) {
        var text = config.getUserText(el);
        if (text && text.length > 0) {
          allMessages.push({ role: 'user', content: text, el: el });
        }
      });

      assistantEls.forEach(function (el, index) {
        var text = config.getAssistantText(el);
        if (text && text.length > 3) {
          allMessages.push({ role: 'assistant', content: text, el: el, isComplete: true });
        }
      });

      allMessages.sort(function (a, b) {
        var pos = a.el.compareDocumentPosition(b.el);
        if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
        return 0;
      });

      for (var i = 0; i < allMessages.length; i++) {
        var msg = allMessages[i];
        this._addFingerprint(this._fingerprint(msg.role, msg.content));
      }

      this._knownAssistantCount = assistantEls.length;

      this._lastAssistantText = '';
      for (var j = allMessages.length - 1; j >= 0; j--) {
        if (allMessages[j].role === 'assistant') {
          this._lastAssistantText = allMessages[j].content;
          break;
        }
      }

      if (userEls.length === 0 && assistantEls.length > 0) {
        var foundByProbe = this._probeUserMessages(config, assistantEls);
        if (foundByProbe.length > 0) {
          for (var p = 0; p < foundByProbe.length; p++) {
            allMessages.push(foundByProbe[p]);
          }
          allMessages.sort(function (a, b) {
            var pos = a.el.compareDocumentPosition(b.el);
            if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
            if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
            return 0;
          });
        }
      }

      if (allMessages.length > 0) {
        var self = this;
        var conversations = allMessages.map(function (m) {
          var out = {
            role: m.role,
            content: m.content,
            isComplete: true,
            timestamp: Date.now()
          };
          if (siteId === 'deepseek') {
            var messageKey = self._extractDeepseekMessageKey(m.el);
            if (messageKey) out.messageKey = messageKey;
          }
          return out;
        });

        console.log('[PolyChat] 初始扫描完成，共', allMessages.length, '条消息');
        this._sendCaptureToBackground(conversations);
      }
    },

    /**
     * 探测用户消息
     */
    _probeUserMessages: function (config, assistantEls) {
      var results = [];
      if (!assistantEls || assistantEls.length === 0) return results;

      var parent = assistantEls[0].parentElement;
      if (!parent) return results;

      var children = parent.children;
      var userTextsFound = new Set();
      var assistantSet = new Set();
      
      for (var a = 0; a < assistantEls.length; a++) {
        assistantSet.add(assistantEls[a]);
      }

      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (assistantSet.has(child)) continue;

        var style = window.getComputedStyle ? window.getComputedStyle(child) : {};
        if (style.display === 'none' || style.visibility === 'hidden') continue;

        var text = cleanAnswerText((child.innerText || child.textContent || '').trim());
        if (!text || text.length < 2) continue;

        if (/^参考\d+篇资料$/.test(text)) continue;
        if (/^相关搜索/.test(text)) continue;
        if (/^查看更多/.test(text)) continue;

        var fp = this._fingerprint('user', text);
        if (this._knownMessages.has(fp)) continue;
        if (userTextsFound.has(text)) continue;
        if (text.length > 2000) continue;

        userTextsFound.add(text);
        results.push({ role: 'user', content: text, el: child });
      }

      return results;
    },

    /**
     * 强制全量捕获
     */
    _forceFullCapture: function () {
      var config = this._siteConfig[siteId];
      if (!config || !this._isObserving) return;

      var userEls = this._querySelectorAll(config, 'user');
      var assistantEls = this._querySelectorAll(config, 'assistant');
      var allMessages = [];

      userEls.forEach(function (el) {
        var text = config.getUserText(el);
        if (text && text.length > 0) {
          allMessages.push({ role: 'user', content: text, el: el });
        }
      });

      assistantEls.forEach(function (el) {
        var text = config.getAssistantText(el);
        if (text && text.length > 0) {
          allMessages.push({ role: 'assistant', content: text, el: el });
        }
      });

      if (userEls.length === 0 && assistantEls.length > 0) {
        var probed = this._probeUserMessages(config, assistantEls);
        for (var p = 0; p < probed.length; p++) {
          allMessages.push(probed[p]);
        }
      }

      allMessages.sort(function (a, b) {
        var pos = a.el.compareDocumentPosition(b.el);
        if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
        return 0;
      });

      if (siteId === 'deepseek' && this._pendingComposerUserText) {
        var pendingRaw = String(this._pendingComposerUserText).trim();
        var pfp = this._fingerprint('user', pendingRaw);
        var alreadyUser = false;
        for (var u = 0; u < allMessages.length; u++) {
          if (allMessages[u].role === 'user' && this._fingerprint('user', allMessages[u].content) === pfp) {
            alreadyUser = true;
            break;
          }
        }
        if (pendingRaw && !alreadyUser) {
          var ins = allMessages.length;
          for (var ai = allMessages.length - 1; ai >= 0; ai--) {
            if (allMessages[ai].role === 'assistant') {
              ins = ai;
              break;
            }
          }
          var anchorEl = ins < allMessages.length ? allMessages[ins].el : (assistantEls.length ? assistantEls[assistantEls.length - 1] : document.body);
          allMessages.splice(ins, 0, { role: 'user', content: pendingRaw, el: anchorEl });
        }
        this._pendingComposerUserText = null;
      }

      if (allMessages.length === 0) return;

      this._knownAssistantCount = assistantEls.length;
      this._lastAssistantText = '';
      for (var j = allMessages.length - 1; j >= 0; j--) {
        if (allMessages[j].role === 'assistant') {
          this._lastAssistantText = allMessages[j].content;
          break;
        }
      }

      for (var k = 0; k < allMessages.length; k++) {
        if (allMessages[k].content) {
          this._addFingerprint(this._fingerprint(allMessages[k].role, allMessages[k].content));
        }
      }

      var self = this;
      var conversations = allMessages.map(function (m) {
        var out = {
          role: m.role,
          content: m.content,
          isComplete: true,
          timestamp: Date.now()
        };
        if (siteId === 'deepseek') {
          var messageKey = self._extractDeepseekMessageKey(m.el);
          if (messageKey) out.messageKey = messageKey;
        }
        return out;
      });

      console.log('[PolyChat] 全量 CAPTURE，', conversations.length, '条消息');
      this._sendCaptureToBackground(conversations);
    },

    /**
     * Mutation 回调
     */
    _onMutation: function () {
      if (!this._isObserving) return;
      this._checkSendButtonState();
    },

    /**
     * 发送到 Background
     */
    _sendCaptureToBackground: function (conversations) {
      if (!this._id || !conversations.length) return;
      try {
        console.log('[PolyChat] 发送CAPTURE_CONVERSATIONS，消息数:', conversations.length);
        
        // 获取会话标题
        var sessionTitle = document.title;
        
        // 对于文心一言，使用专门的标题提取
        if (siteId === 'yiyan') {
          var extractedTitle = extractYiyanSessionTitle();
          if (extractedTitle) {
            sessionTitle = extractedTitle;
          }
        }
        
        chrome.runtime.sendMessage({
          type: 'CAPTURE_CONVERSATIONS',
          conversationId: this._conversationId,
          id: this._id,
          url: window.location.href,
          title: sessionTitle,
          conversations: conversations,
          observeMode: this._observeMode  // 新增：上报观察模式
        }, function(response) {
          if (chrome.runtime.lastError) {
            console.error('[PolyChat] CAPTURE_CONVERSATIONS发送失败:', chrome.runtime.lastError.message);
          }
        });
      } catch (e) {
        console.error('[PolyChat] CAPTURE_CONVERSATIONS异常:', e.message);
      }
    },
  };

  // ==================== 适配器定义 ====================

  var doubaoAssistantBlockSelector = '[data-testid="message-block-container"]:not(:has(> [data-testid="send_message"]))';

  var doubaoAdapter = {
    sendQuestion: function (prompt) {
      var inputSelector = 'textarea[placeholder*="输入"], textarea[placeholder*="问"], textarea';
      var sendSelector = 'button[type="submit"], button[aria-label*="发送"], [class*="send"] button';
      var answerSelector = doubaoAssistantBlockSelector;
      var inputEl;
      return waitFor(inputSelector).then(function (input) {
        inputEl = input; setInputValue(input, prompt); return wait(300);
      }).then(function () {
        var countBefore = document.querySelectorAll(answerSelector).length;
        var sendBtn = document.querySelector(sendSelector);
        if (sendBtn) sendBtn.click();
        else if (inputEl) inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
        return captureNewAnswer(answerSelector, 90000, { initialCount: countBefore, readText: function () { return readDoubaoAssistantAnswerText(document.body); } });
      }).then(function (answer) { return { status: 'ok', answer: answer, error: null }; }).catch(function (err) { return { status: 'error', error: err.message || String(err), answer: null }; });
    },
    sendQuestionStream: function (prompt, requestId, tabId) {
      var inputSelector = 'textarea[placeholder*="输入"], textarea[placeholder*="问"], textarea';
      var sendSelector = 'button[type="submit"], button[aria-label*="发送"], [class*="send"] button';
      var answerSelector = doubaoAssistantBlockSelector;
      var inputEl;
      var assistantCountBefore = document.querySelectorAll(answerSelector).length;
      return waitFor(inputSelector).then(function (input) {
        inputEl = input; setInputValue(input, prompt); return wait(300);
      }).then(function () {
        var sendBtn = document.querySelector(sendSelector);
        if (sendBtn) sendBtn.click();
        else if (inputEl) inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
        return captureNewAnswer(answerSelector, 90000, { initialCount: assistantCountBefore, readText: function () { return readDoubaoAssistantAnswerText(document.body); } });
      }).then(function (answer) {
        return streamResultFromCaptureAnswer(answer);
      }).then(function (res) {
        sendRuntimeMessageSafe({ type: 'STREAM_DONE', requestId: requestId, tabId: tabId, siteId: siteId, status: res.status === 'success' ? 'success' : res.status === 'timeout' ? 'timeout' : 'error', answer: res.answer != null ? res.answer : null, error: res.error != null ? res.error : null });
        return res;
      }).catch(function (err) {
        sendRuntimeMessageSafe({ type: 'STREAM_DONE', requestId: requestId, tabId: tabId, siteId: siteId, status: 'error', answer: null, error: err && err.message ? err.message : String(err) });
        return { status: 'error', answer: null, error: err && err.message ? err.message : String(err) };
      });
    },
  };

  var yuanbaoAdapter = {
    sendQuestion: function (prompt) {
      var inputSelector = '#searchbar-editor div.ql-editor[contenteditable="true"], div.ql-editor[contenteditable="true"]';
      var sendSelector = 'a#yuanbao-send-btn';
      var answerSelector = '.agent-chat__list__item--ai[data-conv-speaker="ai"]';
      var inputEl;
      return waitFor(inputSelector).then(function (input) {
        inputEl = input; setInputValue(input, prompt); return wait(300);
      }).then(function () {
        var countBefore = document.querySelectorAll(answerSelector).length;
        var sendBtn = document.querySelector(sendSelector);
        if (sendBtn) sendBtn.click();
        else if (inputEl) inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
        return captureNewAnswer(answerSelector, 90000, { initialCount: countBefore, readText: function () { return readYuanbaoAssistantAnswerText(document.body); } });
      }).then(function (answer) { return { status: 'ok', answer: answer, error: null }; }).catch(function (err) { return { status: 'error', error: err.message || String(err), answer: null }; });
    },
    sendQuestionStream: function (prompt, requestId, tabId) {
      var inputSelector = '#searchbar-editor div.ql-editor[contenteditable="true"], div.ql-editor[contenteditable="true"]';
      var sendSelector = 'a#yuanbao-send-btn';
      var answerSelector = '.agent-chat__list__item--ai[data-conv-speaker="ai"]';
      var inputEl;
      var initialCount = 0;
      return waitFor(inputSelector).then(function (input) {
        inputEl = input; setInputValue(input, prompt); return wait(300);
      }).then(function () {
        initialCount = document.querySelectorAll(answerSelector).length;
        var sendBtn = document.querySelector(sendSelector);
        if (sendBtn) sendBtn.click();
        else if (inputEl) inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
        return captureNewAnswer(answerSelector, 90000, { initialCount: initialCount, readText: function () { return readYuanbaoAssistantAnswerText(document.body); } });
      }).then(function (answer) {
        return streamResultFromCaptureAnswer(answer);
      }).then(function (res) {
        sendRuntimeMessageSafe({ type: 'STREAM_DONE', requestId: requestId, tabId: tabId, siteId: siteId, status: res.status === 'success' ? 'success' : res.status === 'timeout' ? 'timeout' : 'error', answer: res.answer != null ? res.answer : null, error: res.error != null ? res.error : null });
        return res;
      }).catch(function (err) {
        sendRuntimeMessageSafe({ type: 'STREAM_DONE', requestId: requestId, tabId: tabId, siteId: siteId, status: 'error', answer: null, error: err && err.message ? err.message : String(err) });
        return { status: 'error', answer: null, error: err && err.message ? err.message : String(err) };
      });
    },
  };

  var kimiAdapter = {
    sendQuestion: function (prompt) {
      var inputSelector = '#chat-box .chat-input-editor, .chat-input-editor-container .chat-input-editor, .chat-input-editor[contenteditable="true"]';
      var sendSelector = 'div.send-button-container:not(.disabled), div.send-button-container';
      var answerSelector = 'div.chat-content-item-assistant';
      var inputEl;
      return waitFor(inputSelector, document, 20000).then(function (input) {
        inputEl = input; setLexicalOrContentEditableInput(input, prompt); return wait(600);
      }).then(function () {
        var countBefore = document.querySelectorAll(answerSelector).length;
        var sendBtn = document.querySelector('div.send-button-container:not(.disabled)') || document.querySelector('div.send-button-container');
        if (sendBtn) sendBtn.click();
        else if (inputEl) inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
        return captureNewAnswer(answerSelector, 90000, { initialCount: countBefore, readText: function () { return readKimiAssistantAnswerText(document.body); } });
      }).then(function (answer) { return { status: 'ok', answer: answer, error: null }; }).catch(function (err) { return { status: 'error', error: err.message || String(err), answer: null }; });
    },
    sendQuestionStream: function (prompt, requestId, tabId) {
      var inputSelector = '#chat-box .chat-input-editor, .chat-input-editor-container .chat-input-editor, .chat-input-editor[contenteditable="true"]';
      var sendSelector = 'div.send-button-container:not(.disabled), div.send-button-container';
      var answerSelector = 'div.chat-content-item-assistant';
      var inputEl;
      var segmentCountBefore = document.querySelectorAll(answerSelector).length;
      return waitFor(inputSelector, document, 20000).then(function (input) {
        inputEl = input; setLexicalOrContentEditableInput(input, prompt); return wait(600);
      }).then(function () {
        var sendBtn = document.querySelector('div.send-button-container:not(.disabled)') || document.querySelector('div.send-button-container');
        if (sendBtn) sendBtn.click();
        else if (inputEl) inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
        return captureNewAnswer(answerSelector, 90000, { initialCount: segmentCountBefore, readText: function () { return readKimiAssistantAnswerText(document.body); } });
      }).then(function (answer) {
        return streamResultFromCaptureAnswer(answer);
      }).then(function (res) {
        sendRuntimeMessageSafe({ type: 'STREAM_DONE', requestId: requestId, tabId: tabId, siteId: siteId, status: res.status === 'success' ? 'success' : res.status === 'timeout' ? 'timeout' : 'error', answer: res.answer != null ? res.answer : null, error: res.error != null ? res.error : null });
        return res;
      }).catch(function (err) {
        sendRuntimeMessageSafe({ type: 'STREAM_DONE', requestId: requestId, tabId: tabId, siteId: siteId, status: 'error', answer: null, error: err && err.message ? err.message : String(err) });
        return { status: 'error', answer: null, error: err && err.message ? err.message : String(err) };
      });
    },
  };

  function deepseekAnswerNodeFilter(el) {
    return !!(el && el.closest && !el.closest('.ds-think-content'));
  }

  var deepseekAdapter = {
    sendQuestion: function (prompt) {
      var inputSelector = 'div.ds-scroll-area.ds-textarea textarea, .ds-scroll-area.ds-textarea textarea, textarea[placeholder*="消息"], textarea[placeholder*="问"], textarea[placeholder*="输入"], div[contenteditable="true"][role="textbox"], #root textarea, textarea';
      var sendSelector = 'button[type="submit"], button[aria-label*="发送"], button[aria-label*="Send"], div[role="button"][aria-label*="发送"]';
      var answerSelector = '.ds-markdown';
      var inputEl;
      return waitFor(inputSelector, document, 20000).then(function (input) {
        inputEl = input;
        setDeepseekPrompt(input, prompt);
        return wait(400);
      }).then(function () {
        var countBefore = countMatchingNodes(document.body, answerSelector, deepseekAnswerNodeFilter);
        var sendBtn = document.querySelector(sendSelector);
        if (sendBtn) sendBtn.click();
        else if (inputEl) inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
        return captureNewAnswer(answerSelector, 90000, { initialCount: countBefore, answerNodeFilter: deepseekAnswerNodeFilter, readText: function () { return readDeepseekAssistantAnswerText(document.body); } });
      }).then(function (answer) { return { status: 'ok', answer: answer, error: null }; }).catch(function (err) { return { status: 'error', error: err.message || String(err), answer: null }; });
    },
    sendQuestionStream: function (prompt, requestId, tabId) {
      var inputSelector = 'div.ds-scroll-area.ds-textarea textarea, .ds-scroll-area.ds-textarea textarea, textarea[placeholder*="消息"], textarea[placeholder*="问"], textarea[placeholder*="输入"], div[contenteditable="true"][role="textbox"], #root textarea, textarea';
      var sendSelector = 'button[type="submit"], button[aria-label*="发送"], button[aria-label*="Send"], div[role="button"][aria-label*="发送"]';
      var answerSelector = '.ds-markdown';
      var inputEl;
      return waitFor(inputSelector, document, 20000).then(function (input) {
        inputEl = input;
        setDeepseekPrompt(input, prompt);
        return wait(400);
      }).then(function () {
        var countBefore = countMatchingNodes(document.body, answerSelector, deepseekAnswerNodeFilter);
        var sendBtn = document.querySelector(sendSelector);
        if (sendBtn) sendBtn.click();
        else if (inputEl) inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
        return captureNewAnswer(answerSelector, 90000, { initialCount: countBefore, answerNodeFilter: deepseekAnswerNodeFilter, readText: function () { return readDeepseekAssistantAnswerText(document.body); } });
      }).then(function (answer) {
        return streamResultFromCaptureAnswer(answer);
      }).then(function (res) {
        sendRuntimeMessageSafe({ type: 'STREAM_DONE', requestId: requestId, tabId: tabId, siteId: siteId, status: res.status === 'success' ? 'success' : res.status === 'timeout' ? 'timeout' : 'error', answer: res.answer != null ? res.answer : null, error: res.error != null ? res.error : null });
        return res;
      }).catch(function (err) {
        sendRuntimeMessageSafe({ type: 'STREAM_DONE', requestId: requestId, tabId: tabId, siteId: siteId, status: 'error', answer: null, error: err && err.message ? err.message : String(err) });
        return { status: 'error', answer: null, error: err && err.message ? err.message : String(err) };
      });
    },
  };

  function readGeminiAssistantAnswerText(root) {
    root = root || document.body;
    var selectors = [
      'model-response',
      '[data-test-id="model-response"]',
      'div[class*="model-response"]',
      '.response-content',
      'message-content'
    ];
    for (var s = 0; s < selectors.length; s++) {
      var els = root.querySelectorAll(selectors[s]);
      if (els.length > 0) {
        var el = els[els.length - 1];
        var clone = el.cloneNode(true);
        clone.querySelectorAll('button, [class*="toolbar"], [class*="action"]').forEach(function (n) { n.remove(); });
        var raw = cleanAnswerText((clone.innerText || clone.textContent || '').trim());
        if (raw && raw.length > 2) return raw;
      }
    }
    return null;
  }

  function setGeminiInput(el, text) {
    el.focus();
    var iterations = 0;
    var maxIterations = 3;

    function trySet() {
      try {
        el.innerHTML = '';
        el.innerText = '';
        el.textContent = '';
        el.innerText = text;
        el.textContent = text;

        if (el.innerText === '' || el.innerText.length < text.length) {
          try {
            document.execCommand('selectAll', false, null);
            document.execCommand('insertText', false, text);
          } catch (e) {}
        }

        if (el.innerText.length < text.length) {
          try {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(true);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            document.execCommand('insertText', false, text);
          } catch (e) {}
        }
      } catch (e) {}
    }

    trySet();

    el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', keyCode: 65, bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', keyCode: 65, bubbles: true }));
  }

  var geminiAdapter = {
    sendQuestion: function (prompt) {
      var inputSelector = '[contenteditable="true"][role="textbox"], [contenteditable="true"], textarea, .ql-editor, [data-test-id="composer-input"], [data-test-id="input-text-area"]';
      var sendSelector = '.send-button-container button.send-button.submit, button.send-button.submit[aria-label="发送"], button.send-button.submit[aria-label="Send"]';
      var answerSelector = 'model-response, [data-test-id="model-response"], div[class*="model-response"]';
      var inputEl;
      return waitFor(inputSelector, document, 20000).then(function (input) {
        inputEl = input;
        setGeminiInput(input, prompt);
        return wait(800);
      }).then(function () {
        var countBefore = document.querySelectorAll(answerSelector).length;
        var sendBtn = document.querySelector(sendSelector);
        if (sendBtn) sendBtn.click();
        else if (inputEl) inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
        return captureNewAnswer(answerSelector, 90000, { initialCount: countBefore, readText: function () { return readGeminiAssistantAnswerText(document.body); } });
      }).then(function (answer) { return { status: 'ok', answer: answer, error: null }; }).catch(function (err) { return { status: 'error', error: err.message || String(err), answer: null }; });
    },
    sendQuestionStream: function (prompt, requestId, tabId) {
      var inputSelector = '[contenteditable="true"][role="textbox"], [contenteditable="true"], textarea, .ql-editor, [data-test-id="composer-input"], [data-test-id="input-text-area"]';
      var sendSelector = '.send-button-container button.send-button.submit, button.send-button.submit[aria-label="发送"], button.send-button.submit[aria-label="Send"]';
      var answerSelector = 'model-response, [data-test-id="model-response"], div[class*="model-response"]';
      var inputEl;
      var initialCount = 0;
      return waitFor(inputSelector, document, 20000).then(function (input) {
        inputEl = input;
        setGeminiInput(input, prompt);
        return wait(800);
      }).then(function () {
        initialCount = document.querySelectorAll(answerSelector).length;
        var sendBtn = document.querySelector(sendSelector);
        if (sendBtn) sendBtn.click();
        else if (inputEl) inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
        return captureNewAnswer(answerSelector, 90000, { initialCount: initialCount, readText: function () { return readGeminiAssistantAnswerText(document.body); } });
      }).then(function (answer) {
        return streamResultFromCaptureAnswer(answer);
      }).then(function (res) {
        sendRuntimeMessageSafe({ type: 'STREAM_DONE', requestId: requestId, tabId: tabId, siteId: siteId, status: res.status === 'success' ? 'success' : res.status === 'timeout' ? 'timeout' : 'error', answer: res.answer != null ? res.answer : null, error: res.error != null ? res.error : null });
        return res;
      }).catch(function (err) {
        sendRuntimeMessageSafe({ type: 'STREAM_DONE', requestId: requestId, tabId: tabId, siteId: siteId, status: 'error', answer: null, error: err && err.message ? err.message : String(err) });
        return { status: 'error', answer: null, error: err && err.message ? err.message : String(err) };
      });
    },
  };

  function readGrokAssistantAnswerText(root) {
    root = root || document.body;
    var selectors = [
      'div[class*="assistant-message"]',
      'div[class*="model-response"]',
      'div[class*="message-assistant"]',
      '[data-role="assistant"]',
      '[class*="chat-message"][class*="assistant"]'
    ];
    for (var s = 0; s < selectors.length; s++) {
      var els = root.querySelectorAll(selectors[s]);
      if (els.length > 0) {
        var el = els[els.length - 1];
        var clone = el.cloneNode(true);
        clone.querySelectorAll('button, [class*="toolbar"], [class*="action"], [class*="copy"]').forEach(function (n) { n.remove(); });
        var raw = cleanAnswerText((clone.innerText || clone.textContent || '').trim());
        if (raw && raw.length > 2) return raw;
      }
    }
    return null;
  }

  function setGrokInput(el, text) {
    el.focus();
    try {
      el.innerHTML = '';
      el.innerText = '';
      el.textContent = '';
      el.innerText = text;
      el.textContent = text;

      if (el.innerText === '' || el.innerText.length < text.length) {
        try {
          document.execCommand('selectAll', false, null);
          document.execCommand('insertText', false, text);
        } catch (e) {}
      }

      if (el.innerText.length < text.length) {
        try {
          var range = document.createRange();
          range.selectNodeContents(el);
          range.collapse(true);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          document.execCommand('insertText', false, text);
        } catch (e) {}
      }
    } catch (e) {}

    el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', keyCode: 65, bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', keyCode: 65, bubbles: true }));
  }

  var grokAdapter = {
    sendQuestion: function (prompt) {
      var inputSelector = '[contenteditable="true"][role="textbox"], [contenteditable="true"], textarea, .ql-editor, [data-test-id="composer-input"], [data-test-id="input-text-area"], input[type="text"]';
      var sendSelector = 'button[aria-label="Send message"], button[aria-label="发送消息"], button[aria-label="Send"].send-button, button[aria-label="发送"].send-button, .chat-input-container button, .message-input-container button, button.send-button:not([aria-label*="展开"]):not([aria-label*="收起"]), button.submit-button:not([aria-label*="展开"]):not([aria-label*="收起"]), button[type="submit"]:not([aria-label*="展开"]):not([aria-label*="收起"]), button:has(svg[aria-label="Send"]), button:has(svg[aria-label="发送"]), button:has(svg)[class*="send"]';
      var answerSelector = 'div[class*="assistant-message"], div[class*="model-response"]';
      var inputEl;
      return waitFor(inputSelector, document, 20000).then(function (input) {
        inputEl = input;
        setGrokInput(input, prompt);
        return wait(800);
      }).then(function () {
        var countBefore = document.querySelectorAll(answerSelector).length;
        var sendBtn = document.querySelector(sendSelector);
        if (sendBtn) sendBtn.click();
        else if (inputEl) inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
        return captureNewAnswer(answerSelector, 90000, { initialCount: countBefore, readText: function () { return readGrokAssistantAnswerText(document.body); } });
      }).then(function (answer) { return { status: 'ok', answer: answer, error: null }; }).catch(function (err) { return { status: 'error', error: err.message || String(err), answer: null }; });
    },
    sendQuestionStream: function (prompt, requestId, tabId) {
      var inputSelector = '[contenteditable="true"][role="textbox"], [contenteditable="true"], textarea, .ql-editor, [data-test-id="composer-input"], [data-test-id="input-text-area"], input[type="text"]';
      var sendSelector = 'button[aria-label="Send message"], button[aria-label="发送消息"], button[aria-label="Send"].send-button, button[aria-label="发送"].send-button, .chat-input-container button, .message-input-container button, button.send-button:not([aria-label*="展开"]):not([aria-label*="收起"]), button.submit-button:not([aria-label*="展开"]):not([aria-label*="收起"]), button[type="submit"]:not([aria-label*="展开"]):not([aria-label*="收起"]), button:has(svg[aria-label="Send"]), button:has(svg[aria-label="发送"]), button:has(svg)[class*="send"]';
      var answerSelector = 'div[class*="assistant-message"], div[class*="model-response"]';
      var inputEl;
      var initialCount = 0;
      return waitFor(inputSelector, document, 20000).then(function (input) {
        inputEl = input;
        setGrokInput(input, prompt);
        return wait(800);
      }).then(function () {
        initialCount = document.querySelectorAll(answerSelector).length;
        var sendBtn = document.querySelector(sendSelector);
        if (sendBtn) sendBtn.click();
        else if (inputEl) inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
        return captureNewAnswer(answerSelector, 90000, { initialCount: initialCount, readText: function () { return readGrokAssistantAnswerText(document.body); } });
      }).then(function (answer) {
        return streamResultFromCaptureAnswer(answer);
      }).then(function (res) {
        sendRuntimeMessageSafe({ type: 'STREAM_DONE', requestId: requestId, tabId: tabId, siteId: siteId, status: res.status === 'success' ? 'success' : res.status === 'timeout' ? 'timeout' : 'error', answer: res.answer != null ? res.answer : null, error: res.error != null ? res.error : null });
        return res;
      }).catch(function (err) {
        sendRuntimeMessageSafe({ type: 'STREAM_DONE', requestId: requestId, tabId: tabId, siteId: siteId, status: 'error', answer: null, error: err && err.message ? err.message : String(err) });
        return { status: 'error', answer: null, error: err && err.message ? err.message : String(err) };
      });
    },
  };

  /** 从逗号分隔选择器串中解析当前仍在文档内的文心编辑根（Slate 重绘后原引用会失效） */
  function yiyanResolveEditor(selectorString, cur) {
    if (cur && cur instanceof Element && cur.isConnected) return cur;
    if (!selectorString) return (cur && cur instanceof Element) ? cur : null;
    var parts = String(selectorString).split(',');
    for (var p = 0; p < parts.length; p++) {
      var sel = parts[p].trim();
      if (!sel) continue;
      try {
        var found = document.querySelector(sel);
        if (found && found.isConnected) return found;
      } catch (_) {}
    }
    return null;
  }

  /**
   * 文心 Slate：把选区放到可映射的「字符串叶子」内的文本末尾。
   * 文心正文在 [data-slate-string="true"] 下的 Text 节点；选区若落在外层 span 上会触发 toSlateNode(HTMLSpanElement)。
   */
  function moveYiyanCaretToEndSafe(el) {
    if (!el || !(el instanceof Element) || !el.isConnected) return;
    var selection = window.getSelection && window.getSelection();
    if (!selection) {
      try { el.focus(); } catch (_) {}
      return;
    }

    function acceptYiyanTextNode(node) {
      if (!node || node.nodeType !== Node.TEXT_NODE || !node.parentElement) return false;
      var pe = node.parentElement;
      if (!el.contains(node)) return false;
      if (pe.closest('[data-slate-placeholder="true"]')) return false;
      var ceFalse = pe.closest('[contenteditable="false"]');
      if (ceFalse && el.contains(ceFalse) && ceFalse !== el) return false;
      return true;
    }

    function placeAtTextEnd(textNode) {
      if (!textNode || !textNode.isConnected || textNode.nodeType !== Node.TEXT_NODE) return false;
      try {
        selection.removeAllRanges();
        var range = document.createRange();
        var len = (textNode.nodeValue || '').length;
        range.setStart(textNode, len);
        range.setEnd(textNode, len);
        if (range.startContainer && range.startContainer.isConnected) {
          selection.addRange(range);
          return true;
        }
      } catch (_) {}
      return false;
    }

    try {
      var strHosts = el.querySelectorAll('[data-slate-string="true"]');
      for (var j = strHosts.length - 1; j >= 0; j--) {
        var host = strHosts[j];
        if (!host || !host.isConnected || !el.contains(host)) continue;
        var lastInHost = null;
        var w = document.createTreeWalker(host, NodeFilter.SHOW_TEXT, null);
        var t;
        while ((t = w.nextNode())) {
          if (acceptYiyanTextNode(t)) lastInHost = t;
        }
        if (lastInHost && placeAtTextEnd(lastInHost)) return;
      }
    } catch (_) {}

    try {
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
          return acceptYiyanTextNode(n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      var last = null;
      var cur;
      while ((cur = walker.nextNode())) last = cur;
      if (last && placeAtTextEnd(last)) return;
    } catch (_) {}

    try {
      el.focus();
    } catch (_) {}
  }

  /** 在光标处插入一段文本（单块），不整段替换 innerHTML */
  function yiyanSlateInsertChunk(el, chunk, editorSelector) {
    if (chunk == null || chunk === '') return;
    var live = yiyanResolveEditor(editorSelector, el);
    if (!live) return;
    live.focus();
    moveYiyanCaretToEndSafe(live);
    try {
      live.dispatchEvent(new InputEvent('beforeinput', {
        bubbles: true,
        composed: true,
        cancelable: false,
        inputType: 'insertText',
        data: chunk
      }));
    } catch (_) {}
    var inserted = false;
    try {
      inserted = document.execCommand('insertText', false, chunk);
    } catch (_) {}
    if (!inserted) {
      try {
        document.execCommand('insertText', false, chunk);
      } catch (_) {}
    }
    try {
      live.dispatchEvent(new InputEvent('input', {
        bubbles: true,
        composed: true,
        cancelable: false,
        inputType: 'insertText',
        data: chunk
      }));
    } catch (_) {
      live.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    }
  }

  /**
   * 写入文心输入框。Slate 在长文本一次性 insert 时易崩（Cannot resolve a Slate node from DOM node），
   * 超过阈值则先清空再分块插入，块之间留出间隔让 React/Slate 提交状态。
   * @param {string} [editorSelector] 逗号分隔选择器，长文本分块时每步重新解析编辑根
   * @returns {Promise<void>}
   */
  function setYiyanInput(el, text, editorSelector) {
    return new Promise(function (resolve, reject) {
      var normalizedText = text == null ? '' : String(text);
      el.focus();

      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
        try {
          var proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
          var valueSetter = Object.getOwnPropertyDescriptor(proto, 'value');
          if (valueSetter && valueSetter.set) valueSetter.set.call(el, normalizedText);
          else el.value = normalizedText;
          el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
          el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        } catch (e) {
          reject(e);
          return;
        }
        resolve();
        return;
      }

      var CHUNK = 400;
      var PAUSE_MS = 70;
      var LONG_THRESHOLD = 480;

      function finishShortSlate() {
        try {
          moveYiyanCaretToEndSafe(el);
          try {
            el.dispatchEvent(new InputEvent('beforeinput', {
              bubbles: true,
              composed: true,
              cancelable: false,
              inputType: 'insertText',
              data: normalizedText
            }));
          } catch (_) {}
          var inserted = false;
          try {
            inserted = document.execCommand('insertText', false, normalizedText);
          } catch (_) {}
          if (!inserted) {
            el.textContent = normalizedText;
          }
          try {
            el.dispatchEvent(new InputEvent('input', {
              bubbles: true,
              composed: true,
              cancelable: false,
              inputType: 'insertText',
              data: normalizedText
            }));
          } catch (_) {
            el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
          }
          el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        } catch (e) {
          el.textContent = normalizedText;
          el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        }
        resolve();
      }

      if (normalizedText.length <= LONG_THRESHOLD) {
        finishShortSlate();
        return;
      }

      try {
        var root0 = yiyanResolveEditor(editorSelector, el);
        if (!root0) {
          reject(new Error('文心输入栏未找到'));
          return;
        }
        el = root0;
        el.focus();
        try {
          document.execCommand('selectAll', false, null);
          document.execCommand('delete', false, null);
        } catch (_) {}
      } catch (e) {
        reject(e);
        return;
      }

      var pos = 0;
      function step() {
        try {
          var liveRoot = yiyanResolveEditor(editorSelector, el);
          if (!liveRoot) {
            reject(new Error('文心输入栏在写入过程中丢失'));
            return;
          }
          el = liveRoot;
          if (pos >= normalizedText.length) {
            liveRoot.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
            resolve();
            return;
          }
          var chunk = normalizedText.slice(pos, pos + CHUNK);
          var runInsert = function () {
            try {
              yiyanSlateInsertChunk(liveRoot, chunk, editorSelector);
            } catch (ie) {
              reject(ie);
              return;
            }
            pos += CHUNK;
            setTimeout(step, PAUSE_MS);
          };
          if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(function () {
              requestAnimationFrame(runInsert);
            });
          } else {
            runInsert();
          }
        } catch (err) {
          reject(err);
        }
      }
      step();
    });
  }

  function yiyanSendReadyTimeoutMs(promptText) {
    var len = String(promptText == null ? '' : promptText).length;
    var chunks = Math.max(1, Math.ceil(len / 400));
    return Math.min(120000, 10000 + chunks * 100 + Math.floor(len / 2000) * 400);
  }

  function triggerYiyanSend(sendTarget, inputEl) {
    try {
      var s0 = window.getSelection && window.getSelection();
      if (s0) s0.removeAllRanges();
    } catch (_) {}

    function dispatchPointerLikeEvents(target) {
      if (!target || typeof target.dispatchEvent !== 'function') return false;
      try {
        target.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }));
        target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window, button: 0 }));
        target.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window, button: 0 }));
        target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window, button: 0 }));
        return true;
      } catch (_) {
        return false;
      }
    }

    function dispatchPointerEventsAtCenter(target) {
      if (!target || typeof target.getBoundingClientRect !== 'function') return false;
      var rect = target.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      if (rect.width <= 0 || rect.height <= 0) return false;
      var opts = { bubbles: true, cancelable: true, view: window, clientX: cx, clientY: cy, button: 0, buttons: 1 };
      try {
        if (typeof PointerEvent === 'function') {
          target.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, cancelable: true, view: window, clientX: cx, clientY: cy, pointerId: 1, pointerType: 'mouse', isPrimary: true }));
          target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, view: window, clientX: cx, clientY: cy, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: 1 }));
          target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, view: window, clientX: cx, clientY: cy, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: 0 }));
        }
        target.dispatchEvent(new MouseEvent('mousedown', opts));
        target.dispatchEvent(new MouseEvent('mouseup', Object.assign({}, opts, { buttons: 0 })));
        target.dispatchEvent(new MouseEvent('click', Object.assign({}, opts, { buttons: 0 })));
        var under = document.elementFromPoint && document.elementFromPoint(cx, cy);
        if (under && under !== target && typeof under.dispatchEvent === 'function') {
          under.dispatchEvent(new MouseEvent('click', Object.assign({}, opts, { buttons: 0 })));
        }
        return true;
      } catch (_) {
        return false;
      }
    }

    var clicked = false;
    if (sendTarget) {
      var targets = [sendTarget];
      if (sendTarget.closest) {
        var container = sendTarget.closest('.btnContainer__sFTJytvZ, [class*="btnContainer"], .send__slzHSuja');
        if (container && targets.indexOf(container) === -1) targets.unshift(container);
      }
      for (var i = 0; i < targets.length; i++) {
        var t = targets[i];
        try { t.click(); clicked = true; } catch (_) {}
        if (dispatchPointerLikeEvents(t)) clicked = true;
        if (dispatchPointerEventsAtCenter(t)) clicked = true;
      }
    }

    if (!clicked && inputEl) {
      inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
      inputEl.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
      inputEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
    }
  }

  function isElementVisible(el) {
    if (!el || !(el instanceof Element)) return false;
    var style = window.getComputedStyle ? window.getComputedStyle(el) : null;
    if (style) {
      if (style.display === 'none') return false;
      if (style.visibility === 'hidden') return false;
      if (style.opacity === '0') return false;
    }
    var rect = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
    return !!rect && rect.width > 0 && rect.height > 0;
  }

  function findYiyanSendTarget() {
    var candidates = document.querySelectorAll('.send__slzHSuja .btnContainer__sFTJytvZ, .send__slzHSuja [class*="btnContainer"], .send__slzHSuja [class*="sendInner"], .send__slzHSuja .sendBtnLottie');
    for (var i = 0; i < candidates.length; i++) {
      if (isElementVisible(candidates[i])) return candidates[i];
    }
    return candidates.length > 0 ? candidates[0] : null;
  }

  /** 仅当「停止生成」控件可见时视为正在输出，避免隐藏节点导致永远等不到 ready */
  function isYiyanStopVisible() {
    var nodes = document.querySelectorAll('.send__slzHSuja [data-auto-test="stop_response"], .send__slzHSuja .stopDealBtn__j89pyOuJ, .send__slzHSuja [class*="stopDealBtn"], .send__slzHSuja [class*="stopBtn"]');
    for (var i = 0; i < nodes.length; i++) {
      if (isElementVisible(nodes[i])) return true;
    }
    return false;
  }

  function waitForYiyanSendReady(inputEl, timeoutMs) {
    timeoutMs = timeoutMs || 4000;
    return new Promise(function (resolve) {
      var start = Date.now();
      var t = setInterval(function () {
        var text = '';
        if (inputEl) text = String(inputEl.innerText || inputEl.textContent || inputEl.value || '').trim();
        var sendTarget = findYiyanSendTarget();
        var ready = text.length > 0 && sendTarget && isElementVisible(sendTarget) && !isYiyanStopVisible();
        if (ready || Date.now() - start > timeoutMs) {
          clearInterval(t);
          resolve(sendTarget);
        }
      }, 120);
    });
  }

  function yiyanSendWithRetry(inputEl) {
    function once() {
      var sendBtn = findYiyanSendTarget();
      triggerYiyanSend(sendBtn, inputEl);
    }
    once();
    return wait(350).then(function () {
      if (isYiyanStopVisible()) return;
      var text = inputEl ? String(inputEl.innerText || inputEl.textContent || inputEl.value || '').trim() : '';
      if (text.length > 0) once();
    });
  }

  var yiyanAdapter = {
    sendQuestion: function (prompt) {
      var inputSelector = 'div.editable__T7WAW4uW[data-slate-editor="true"][role="textbox"][contenteditable="true"], div[data-slate-editor="true"][role="textbox"][contenteditable="true"], .editorContainer__iPyW4WH9 div[role="textbox"][contenteditable="true"], textarea';
      var answerSelector = 'div[class*="answerBox"], [id="answer_text_id"]';
      var inputEl;
      return waitFor(inputSelector, document, 20000).then(function (input) {
        inputEl = input;
        return setYiyanInput(input, prompt, inputSelector);
      }).then(function () {
        return waitForYiyanSendReady(inputEl, yiyanSendReadyTimeoutMs(prompt));
      }).then(function () {
        var countBefore = document.querySelectorAll(answerSelector).length;
        return yiyanSendWithRetry(inputEl).then(function () {
          return captureNewAnswer(answerSelector, 90000, { initialCount: countBefore, readText: function (el) { return el.innerText || el.textContent || ''; } });
        });
      }).then(function (answer) { return { status: 'ok', answer: answer, error: null }; }).catch(function (err) { return { status: 'error', error: err.message || String(err), answer: null }; });
    },
    sendQuestionStream: function (prompt, requestId, tabId) {
      var inputSelector = 'div.editable__T7WAW4uW[data-slate-editor="true"][role="textbox"][contenteditable="true"], div[data-slate-editor="true"][role="textbox"][contenteditable="true"], .editorContainer__iPyW4WH9 div[role="textbox"][contenteditable="true"], textarea';
      var answerSelector = 'div[class*="answerBox"], [id="answer_text_id"]';
      var inputEl;
      var initialCount = 0;
      return waitFor(inputSelector, document, 20000).then(function (input) {
        inputEl = input;
        return setYiyanInput(input, prompt, inputSelector);
      }).then(function () {
        return waitForYiyanSendReady(inputEl, yiyanSendReadyTimeoutMs(prompt));
      }).then(function () {
        initialCount = document.querySelectorAll(answerSelector).length;
        return yiyanSendWithRetry(inputEl).then(function () {
          return captureNewAnswer(answerSelector, 90000, { initialCount: initialCount, readText: function (el) { return el.innerText || el.textContent || ''; } });
        });
      }).then(function (answer) {
        return streamResultFromCaptureAnswer(answer);
      }).then(function (res) {
        sendRuntimeMessageSafe({ type: 'STREAM_DONE', requestId: requestId, tabId: tabId, siteId: siteId, status: res.status === 'success' ? 'success' : res.status === 'timeout' ? 'timeout' : 'error', answer: res.answer != null ? res.answer : null, error: res.error != null ? res.error : null });
        return res;
      }).catch(function (err) {
        sendRuntimeMessageSafe({ type: 'STREAM_DONE', requestId: requestId, tabId: tabId, siteId: siteId, status: 'error', answer: null, error: err && err.message ? err.message : String(err) });
        return { status: 'error', answer: null, error: err && err.message ? err.message : String(err) };
      });
    },
  };

  var adapters = { doubao: doubaoAdapter, yuanbao: yuanbaoAdapter, kimi: kimiAdapter, deepseek: deepseekAdapter, gemini: geminiAdapter, grok: grokAdapter, yiyan: yiyanAdapter };
  var siteId = getSiteId();
  if (!siteId) return;

  var adapter = adapters[siteId];
  if (!adapter) return;

  // ==================== 初始化 ====================

  setTimeout(function () {
    var conversationId = getCurrentConversationId();

    try {
      chrome.runtime.sendMessage({
        type: 'REGISTER_TAB',
        siteId: siteId,
        url: window.location.href,
        title: document.title,
        conversationId: conversationId
      }, function (response) {
        if (chrome.runtime.lastError || !response) {
          console.log('[PolyChat] 注册Tab失败:', chrome.runtime.lastError?.message);
          return;
        }

        if (response.ok && response.hasConversationId && response.id) {
          ConversationObserver.init(response.conversationId, response.id);
        } else {
          console.log('[PolyChat] 尚无正式 conversationId，轮询 URL 直至可注册');
          ConversationObserver._bootstrapUntilConversationId();
        }
      });
    } catch (e) {
      console.error('[PolyChat] 注册Tab异常:', e);
    }
  }, 2000);

  // ==================== 消息监听 ====================

  chrome.runtime.onMessage.addListener(function (msg, _sender, sendResponse) {
    if (msg.type === 'REGISTER_TAB') {
      return false;
    }

    if (msg.type === 'START_STREAM' && typeof msg.requestId === 'string' && typeof msg.prompt === 'string') {
      var requestId = msg.requestId;
      var tabId = msg.tabId;
      try {
        adapter.sendQuestionStream(msg.prompt, requestId, tabId).catch(function (err) {
          sendRuntimeMessageSafe({ type: 'STREAM_DONE', requestId: requestId, tabId: tabId, siteId: siteId, status: 'error', answer: null, error: err && err.message ? err.message : String(err) });
        });
        sendResponse({ ok: true });
      } catch (err) {
        sendRuntimeMessageSafe({ type: 'STREAM_DONE', requestId: requestId, tabId: tabId, siteId: siteId, status: 'error', answer: null, error: err && err.message ? err.message : String(err) });
        sendResponse({ ok: false, error: err && err.message ? err.message : String(err) });
      }
      return true;
    }

    if (msg.type === 'TRIGGER_CAPTURE') {
      if (ConversationObserver._id) {
        ConversationObserver._scanExistingConversations();
      }
      sendResponse({ ok: true });
      return false;
    }

    if (msg.type === 'POLL_CONVERSATION') {
      const result = ConversationObserver._handlePollRequest();
      sendResponse(result);
      return false;
    }

    if (msg.type !== 'SEND_PROMPT' || typeof msg.prompt !== 'string') {
      sendResponse({ status: 'error', error: '无效请求', siteId: siteId, url: window.location.href });
      return false;
    }

    adapter.sendQuestion(msg.prompt).then(function (result) {
      sendResponse({ status: result.status === 'ok' ? 'ok' : 'error', answer: result.answer != null ? result.answer : null, error: result.error != null ? result.error : null, siteId: siteId, url: window.location.href });
    }).catch(function (err) {
      sendResponse({ status: 'error', answer: null, error: (err && err.message) ? err.message : String(err), siteId: siteId, url: window.location.href });
    });

    return true;
  });
})();
