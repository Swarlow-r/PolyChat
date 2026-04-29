(() => {
  // node_modules/marked/lib/marked.esm.js
  function M() {
    return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
  }
  var T = M();
  function G(u3) {
    T = u3;
  }
  var _ = { exec: () => null };
  function k(u3, e = "") {
    let t = typeof u3 == "string" ? u3 : u3.source, n = { replace: (r, i) => {
      let s = typeof i == "string" ? i : i.source;
      return s = s.replace(m.caret, "$1"), t = t.replace(r, s), n;
    }, getRegex: () => new RegExp(t, e) };
    return n;
  }
  var Re = (() => {
    try {
      return !!new RegExp("(?<=1)(?<!1)");
    } catch {
      return false;
    }
  })();
  var m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (u3) => new RegExp(`^( {0,3}${u3})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}#`), htmlBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}>`) };
  var Te = /^(?:[ \t]*(?:\n|$))+/;
  var Oe = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
  var we = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
  var A = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
  var ye = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
  var N = / {0,3}(?:[*+-]|\d{1,9}[.)])/;
  var re = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
  var se = k(re).replace(/bull/g, N).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
  var Pe = k(re).replace(/bull/g, N).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
  var Q = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
  var Se = /^[^\n]+/;
  var j = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/;
  var $e = k(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", j).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
  var _e = k(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, N).getRegex();
  var q = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
  var F = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
  var Le = k("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", F).replace("tag", q).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
  var ie = k(Q).replace("hr", A).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", q).getRegex();
  var Me = k(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", ie).getRegex();
  var U = { blockquote: Me, code: Oe, def: $e, fences: we, heading: ye, hr: A, html: Le, lheading: se, list: _e, newline: Te, paragraph: ie, table: _, text: Se };
  var te = k("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", A).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", q).getRegex();
  var ze = { ...U, lheading: Pe, table: te, paragraph: k(Q).replace("hr", A).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", te).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", q).getRegex() };
  var Ee = { ...U, html: k(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", F).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: _, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: k(Q).replace("hr", A).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", se).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() };
  var Ie = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
  var Ae = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
  var oe = /^( {2,}|\\)\n(?!\s*$)/;
  var Ce = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
  var v = /[\p{P}\p{S}]/u;
  var K = /[\s\p{P}\p{S}]/u;
  var ae = /[^\s\p{P}\p{S}]/u;
  var Be = k(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, K).getRegex();
  var le = /(?!~)[\p{P}\p{S}]/u;
  var De = /(?!~)[\s\p{P}\p{S}]/u;
  var qe = /(?:[^\s\p{P}\p{S}]|~)/u;
  var ue = /(?![*_])[\p{P}\p{S}]/u;
  var ve = /(?![*_])[\s\p{P}\p{S}]/u;
  var He = /(?:[^\s\p{P}\p{S}]|[*_])/u;
  var Ge = k(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Re ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex();
  var pe = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/;
  var Ze = k(pe, "u").replace(/punct/g, v).getRegex();
  var Ne = k(pe, "u").replace(/punct/g, le).getRegex();
  var ce = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
  var Qe = k(ce, "gu").replace(/notPunctSpace/g, ae).replace(/punctSpace/g, K).replace(/punct/g, v).getRegex();
  var je = k(ce, "gu").replace(/notPunctSpace/g, qe).replace(/punctSpace/g, De).replace(/punct/g, le).getRegex();
  var Fe = k("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ae).replace(/punctSpace/g, K).replace(/punct/g, v).getRegex();
  var Ue = k(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, ue).getRegex();
  var Ke = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)";
  var We = k(Ke, "gu").replace(/notPunctSpace/g, He).replace(/punctSpace/g, ve).replace(/punct/g, ue).getRegex();
  var Xe = k(/\\(punct)/, "gu").replace(/punct/g, v).getRegex();
  var Je = k(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
  var Ve = k(F).replace("(?:-->|$)", "-->").getRegex();
  var Ye = k("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Ve).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
  var D = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/;
  var et = k(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", D).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
  var he = k(/^!?\[(label)\]\[(ref)\]/).replace("label", D).replace("ref", j).getRegex();
  var ke = k(/^!?\[(ref)\](?:\[\])?/).replace("ref", j).getRegex();
  var tt = k("reflink|nolink(?!\\()", "g").replace("reflink", he).replace("nolink", ke).getRegex();
  var ne = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/;
  var W = { _backpedal: _, anyPunctuation: Xe, autolink: Je, blockSkip: Ge, br: oe, code: Ae, del: _, delLDelim: _, delRDelim: _, emStrongLDelim: Ze, emStrongRDelimAst: Qe, emStrongRDelimUnd: Fe, escape: Ie, link: et, nolink: ke, punctuation: Be, reflink: he, reflinkSearch: tt, tag: Ye, text: Ce, url: _ };
  var nt = { ...W, link: k(/^!?\[(label)\]\((.*?)\)/).replace("label", D).getRegex(), reflink: k(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", D).getRegex() };
  var Z = { ...W, emStrongRDelimAst: je, emStrongLDelim: Ne, delLDelim: Ue, delRDelim: We, url: k(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", ne).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: k(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", ne).getRegex() };
  var rt = { ...Z, br: k(oe).replace("{2,}", "*").getRegex(), text: k(Z.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() };
  var C = { normal: U, gfm: ze, pedantic: Ee };
  var z = { normal: W, gfm: Z, breaks: rt, pedantic: nt };
  var st = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  var de = (u3) => st[u3];
  function O(u3, e) {
    if (e) {
      if (m.escapeTest.test(u3)) return u3.replace(m.escapeReplace, de);
    } else if (m.escapeTestNoEncode.test(u3)) return u3.replace(m.escapeReplaceNoEncode, de);
    return u3;
  }
  function X(u3) {
    try {
      u3 = encodeURI(u3).replace(m.percentDecode, "%");
    } catch {
      return null;
    }
    return u3;
  }
  function J(u3, e) {
    let t = u3.replace(m.findPipe, (i, s, a) => {
      let o = false, l = s;
      for (; --l >= 0 && a[l] === "\\"; ) o = !o;
      return o ? "|" : " |";
    }), n = t.split(m.splitPipe), r = 0;
    if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
    else for (; n.length < e; ) n.push("");
    for (; r < n.length; r++) n[r] = n[r].trim().replace(m.slashPipe, "|");
    return n;
  }
  function E(u3, e, t) {
    let n = u3.length;
    if (n === 0) return "";
    let r = 0;
    for (; r < n; ) {
      let i = u3.charAt(n - r - 1);
      if (i === e && !t) r++;
      else if (i !== e && t) r++;
      else break;
    }
    return u3.slice(0, n - r);
  }
  function ge(u3, e) {
    if (u3.indexOf(e[1]) === -1) return -1;
    let t = 0;
    for (let n = 0; n < u3.length; n++) if (u3[n] === "\\") n++;
    else if (u3[n] === e[0]) t++;
    else if (u3[n] === e[1] && (t--, t < 0)) return n;
    return t > 0 ? -2 : -1;
  }
  function fe(u3, e = 0) {
    let t = e, n = "";
    for (let r of u3) if (r === "	") {
      let i = 4 - t % 4;
      n += " ".repeat(i), t += i;
    } else n += r, t++;
    return n;
  }
  function me(u3, e, t, n, r) {
    let i = e.href, s = e.title || null, a = u3[1].replace(r.other.outputLinkReplace, "$1");
    n.state.inLink = true;
    let o = { type: u3[0].charAt(0) === "!" ? "image" : "link", raw: t, href: i, title: s, text: a, tokens: n.inlineTokens(a) };
    return n.state.inLink = false, o;
  }
  function it(u3, e, t) {
    let n = u3.match(t.other.indentCodeCompensation);
    if (n === null) return e;
    let r = n[1];
    return e.split(`
`).map((i) => {
      let s = i.match(t.other.beginningSpace);
      if (s === null) return i;
      let [a] = s;
      return a.length >= r.length ? i.slice(r.length) : i;
    }).join(`
`);
  }
  var w = class {
    options;
    rules;
    lexer;
    constructor(e) {
      this.options = e || T;
    }
    space(e) {
      let t = this.rules.block.newline.exec(e);
      if (t && t[0].length > 0) return { type: "space", raw: t[0] };
    }
    code(e) {
      let t = this.rules.block.code.exec(e);
      if (t) {
        let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
        return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : E(n, `
`) };
      }
    }
    fences(e) {
      let t = this.rules.block.fences.exec(e);
      if (t) {
        let n = t[0], r = it(n, t[3] || "", this.rules);
        return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: r };
      }
    }
    heading(e) {
      let t = this.rules.block.heading.exec(e);
      if (t) {
        let n = t[2].trim();
        if (this.rules.other.endingHash.test(n)) {
          let r = E(n, "#");
          (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (n = r.trim());
        }
        return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
      }
    }
    hr(e) {
      let t = this.rules.block.hr.exec(e);
      if (t) return { type: "hr", raw: E(t[0], `
`) };
    }
    blockquote(e) {
      let t = this.rules.block.blockquote.exec(e);
      if (t) {
        let n = E(t[0], `
`).split(`
`), r = "", i = "", s = [];
        for (; n.length > 0; ) {
          let a = false, o = [], l;
          for (l = 0; l < n.length; l++) if (this.rules.other.blockquoteStart.test(n[l])) o.push(n[l]), a = true;
          else if (!a) o.push(n[l]);
          else break;
          n = n.slice(l);
          let p = o.join(`
`), c = p.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
          r = r ? `${r}
${p}` : p, i = i ? `${i}
${c}` : c;
          let d = this.lexer.state.top;
          if (this.lexer.state.top = true, this.lexer.blockTokens(c, s, true), this.lexer.state.top = d, n.length === 0) break;
          let h = s.at(-1);
          if (h?.type === "code") break;
          if (h?.type === "blockquote") {
            let R = h, f = R.raw + `
` + n.join(`
`), S = this.blockquote(f);
            s[s.length - 1] = S, r = r.substring(0, r.length - R.raw.length) + S.raw, i = i.substring(0, i.length - R.text.length) + S.text;
            break;
          } else if (h?.type === "list") {
            let R = h, f = R.raw + `
` + n.join(`
`), S = this.list(f);
            s[s.length - 1] = S, r = r.substring(0, r.length - h.raw.length) + S.raw, i = i.substring(0, i.length - R.raw.length) + S.raw, n = f.substring(s.at(-1).raw.length).split(`
`);
            continue;
          }
        }
        return { type: "blockquote", raw: r, tokens: s, text: i };
      }
    }
    list(e) {
      let t = this.rules.block.list.exec(e);
      if (t) {
        let n = t[1].trim(), r = n.length > 1, i = { type: "list", raw: "", ordered: r, start: r ? +n.slice(0, -1) : "", loose: false, items: [] };
        n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
        let s = this.rules.other.listItemRegex(n), a = false;
        for (; e; ) {
          let l = false, p = "", c = "";
          if (!(t = s.exec(e)) || this.rules.block.hr.test(e)) break;
          p = t[0], e = e.substring(p.length);
          let d = fe(t[2].split(`
`, 1)[0], t[1].length), h = e.split(`
`, 1)[0], R = !d.trim(), f = 0;
          if (this.options.pedantic ? (f = 2, c = d.trimStart()) : R ? f = t[1].length + 1 : (f = d.search(this.rules.other.nonSpaceChar), f = f > 4 ? 1 : f, c = d.slice(f), f += t[1].length), R && this.rules.other.blankLine.test(h) && (p += h + `
`, e = e.substring(h.length + 1), l = true), !l) {
            let S = this.rules.other.nextBulletRegex(f), V = this.rules.other.hrRegex(f), Y = this.rules.other.fencesBeginRegex(f), ee = this.rules.other.headingBeginRegex(f), xe = this.rules.other.htmlBeginRegex(f), be = this.rules.other.blockquoteBeginRegex(f);
            for (; e; ) {
              let H = e.split(`
`, 1)[0], I;
              if (h = H, this.options.pedantic ? (h = h.replace(this.rules.other.listReplaceNesting, "  "), I = h) : I = h.replace(this.rules.other.tabCharGlobal, "    "), Y.test(h) || ee.test(h) || xe.test(h) || be.test(h) || S.test(h) || V.test(h)) break;
              if (I.search(this.rules.other.nonSpaceChar) >= f || !h.trim()) c += `
` + I.slice(f);
              else {
                if (R || d.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || Y.test(d) || ee.test(d) || V.test(d)) break;
                c += `
` + h;
              }
              R = !h.trim(), p += H + `
`, e = e.substring(H.length + 1), d = I.slice(f);
            }
          }
          i.loose || (a ? i.loose = true : this.rules.other.doubleBlankLine.test(p) && (a = true)), i.items.push({ type: "list_item", raw: p, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: false, text: c, tokens: [] }), i.raw += p;
        }
        let o = i.items.at(-1);
        if (o) o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();
        else return;
        i.raw = i.raw.trimEnd();
        for (let l of i.items) {
          if (this.lexer.state.top = false, l.tokens = this.lexer.blockTokens(l.text, []), l.task) {
            if (l.text = l.text.replace(this.rules.other.listReplaceTask, ""), l.tokens[0]?.type === "text" || l.tokens[0]?.type === "paragraph") {
              l.tokens[0].raw = l.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), l.tokens[0].text = l.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
              for (let c = this.lexer.inlineQueue.length - 1; c >= 0; c--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)) {
                this.lexer.inlineQueue[c].src = this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask, "");
                break;
              }
            }
            let p = this.rules.other.listTaskCheckbox.exec(l.raw);
            if (p) {
              let c = { type: "checkbox", raw: p[0] + " ", checked: p[0] !== "[ ]" };
              l.checked = c.checked, i.loose ? l.tokens[0] && ["paragraph", "text"].includes(l.tokens[0].type) && "tokens" in l.tokens[0] && l.tokens[0].tokens ? (l.tokens[0].raw = c.raw + l.tokens[0].raw, l.tokens[0].text = c.raw + l.tokens[0].text, l.tokens[0].tokens.unshift(c)) : l.tokens.unshift({ type: "paragraph", raw: c.raw, text: c.raw, tokens: [c] }) : l.tokens.unshift(c);
            }
          }
          if (!i.loose) {
            let p = l.tokens.filter((d) => d.type === "space"), c = p.length > 0 && p.some((d) => this.rules.other.anyLine.test(d.raw));
            i.loose = c;
          }
        }
        if (i.loose) for (let l of i.items) {
          l.loose = true;
          for (let p of l.tokens) p.type === "text" && (p.type = "paragraph");
        }
        return i;
      }
    }
    html(e) {
      let t = this.rules.block.html.exec(e);
      if (t) return { type: "html", block: true, raw: t[0], pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: t[0] };
    }
    def(e) {
      let t = this.rules.block.def.exec(e);
      if (t) {
        let n = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
        return { type: "def", tag: n, raw: t[0], href: r, title: i };
      }
    }
    table(e) {
      let t = this.rules.block.table.exec(e);
      if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
      let n = J(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], s = { type: "table", raw: t[0], header: [], align: [], rows: [] };
      if (n.length === r.length) {
        for (let a of r) this.rules.other.tableAlignRight.test(a) ? s.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? s.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? s.align.push("left") : s.align.push(null);
        for (let a = 0; a < n.length; a++) s.header.push({ text: n[a], tokens: this.lexer.inline(n[a]), header: true, align: s.align[a] });
        for (let a of i) s.rows.push(J(a, s.header.length).map((o, l) => ({ text: o, tokens: this.lexer.inline(o), header: false, align: s.align[l] })));
        return s;
      }
    }
    lheading(e) {
      let t = this.rules.block.lheading.exec(e);
      if (t) return { type: "heading", raw: t[0], depth: t[2].charAt(0) === "=" ? 1 : 2, text: t[1], tokens: this.lexer.inline(t[1]) };
    }
    paragraph(e) {
      let t = this.rules.block.paragraph.exec(e);
      if (t) {
        let n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
        return { type: "paragraph", raw: t[0], text: n, tokens: this.lexer.inline(n) };
      }
    }
    text(e) {
      let t = this.rules.block.text.exec(e);
      if (t) return { type: "text", raw: t[0], text: t[0], tokens: this.lexer.inline(t[0]) };
    }
    escape(e) {
      let t = this.rules.inline.escape.exec(e);
      if (t) return { type: "escape", raw: t[0], text: t[1] };
    }
    tag(e) {
      let t = this.rules.inline.tag.exec(e);
      if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: t[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: t[0] };
    }
    link(e) {
      let t = this.rules.inline.link.exec(e);
      if (t) {
        let n = t[2].trim();
        if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
          if (!this.rules.other.endAngleBracket.test(n)) return;
          let s = E(n.slice(0, -1), "\\");
          if ((n.length - s.length) % 2 === 0) return;
        } else {
          let s = ge(t[2], "()");
          if (s === -2) return;
          if (s > -1) {
            let o = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + s;
            t[2] = t[2].substring(0, s), t[0] = t[0].substring(0, o).trim(), t[3] = "";
          }
        }
        let r = t[2], i = "";
        if (this.options.pedantic) {
          let s = this.rules.other.pedanticHrefTitle.exec(r);
          s && (r = s[1], i = s[3]);
        } else i = t[3] ? t[3].slice(1, -1) : "";
        return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? r = r.slice(1) : r = r.slice(1, -1)), me(t, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: i && i.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
      }
    }
    reflink(e, t) {
      let n;
      if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
        let r = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i = t[r.toLowerCase()];
        if (!i) {
          let s = n[0].charAt(0);
          return { type: "text", raw: s, text: s };
        }
        return me(n, i, n[0], this.lexer, this.rules);
      }
    }
    emStrong(e, t, n = "") {
      let r = this.rules.inline.emStrongLDelim.exec(e);
      if (!r || r[3] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
      if (!(r[1] || r[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
        let s = [...r[0]].length - 1, a, o, l = s, p = 0, c = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
        for (c.lastIndex = 0, t = t.slice(-1 * e.length + s); (r = c.exec(t)) != null; ) {
          if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a) continue;
          if (o = [...a].length, r[3] || r[4]) {
            l += o;
            continue;
          } else if ((r[5] || r[6]) && s % 3 && !((s + o) % 3)) {
            p += o;
            continue;
          }
          if (l -= o, l > 0) continue;
          o = Math.min(o, o + l + p);
          let d = [...r[0]][0].length, h = e.slice(0, s + r.index + d + o);
          if (Math.min(s, o) % 2) {
            let f = h.slice(1, -1);
            return { type: "em", raw: h, text: f, tokens: this.lexer.inlineTokens(f) };
          }
          let R = h.slice(2, -2);
          return { type: "strong", raw: h, text: R, tokens: this.lexer.inlineTokens(R) };
        }
      }
    }
    codespan(e) {
      let t = this.rules.inline.code.exec(e);
      if (t) {
        let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(n), i = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
        return r && i && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: t[0], text: n };
      }
    }
    br(e) {
      let t = this.rules.inline.br.exec(e);
      if (t) return { type: "br", raw: t[0] };
    }
    del(e, t, n = "") {
      let r = this.rules.inline.delLDelim.exec(e);
      if (!r) return;
      if (!(r[1] || "") || !n || this.rules.inline.punctuation.exec(n)) {
        let s = [...r[0]].length - 1, a, o, l = s, p = this.rules.inline.delRDelim;
        for (p.lastIndex = 0, t = t.slice(-1 * e.length + s); (r = p.exec(t)) != null; ) {
          if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a || (o = [...a].length, o !== s)) continue;
          if (r[3] || r[4]) {
            l += o;
            continue;
          }
          if (l -= o, l > 0) continue;
          o = Math.min(o, o + l);
          let c = [...r[0]][0].length, d = e.slice(0, s + r.index + c + o), h = d.slice(s, -s);
          return { type: "del", raw: d, text: h, tokens: this.lexer.inlineTokens(h) };
        }
      }
    }
    autolink(e) {
      let t = this.rules.inline.autolink.exec(e);
      if (t) {
        let n, r;
        return t[2] === "@" ? (n = t[1], r = "mailto:" + n) : (n = t[1], r = n), { type: "link", raw: t[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
      }
    }
    url(e) {
      let t;
      if (t = this.rules.inline.url.exec(e)) {
        let n, r;
        if (t[2] === "@") n = t[0], r = "mailto:" + n;
        else {
          let i;
          do
            i = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
          while (i !== t[0]);
          n = t[0], t[1] === "www." ? r = "http://" + t[0] : r = t[0];
        }
        return { type: "link", raw: t[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
      }
    }
    inlineText(e) {
      let t = this.rules.inline.text.exec(e);
      if (t) {
        let n = this.lexer.state.inRawBlock;
        return { type: "text", raw: t[0], text: t[0], escaped: n };
      }
    }
  };
  var x = class u {
    tokens;
    options;
    state;
    inlineQueue;
    tokenizer;
    constructor(e) {
      this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || T, this.options.tokenizer = this.options.tokenizer || new w(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, top: true };
      let t = { other: m, block: C.normal, inline: z.normal };
      this.options.pedantic ? (t.block = C.pedantic, t.inline = z.pedantic) : this.options.gfm && (t.block = C.gfm, this.options.breaks ? t.inline = z.breaks : t.inline = z.gfm), this.tokenizer.rules = t;
    }
    static get rules() {
      return { block: C, inline: z };
    }
    static lex(e, t) {
      return new u(t).lex(e);
    }
    static lexInline(e, t) {
      return new u(t).inlineTokens(e);
    }
    lex(e) {
      e = e.replace(m.carriageReturn, `
`), this.blockTokens(e, this.tokens);
      for (let t = 0; t < this.inlineQueue.length; t++) {
        let n = this.inlineQueue[t];
        this.inlineTokens(n.src, n.tokens);
      }
      return this.inlineQueue = [], this.tokens;
    }
    blockTokens(e, t = [], n = false) {
      for (this.options.pedantic && (e = e.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, "")); e; ) {
        let r;
        if (this.options.extensions?.block?.some((s) => (r = s.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), true) : false)) continue;
        if (r = this.tokenizer.space(e)) {
          e = e.substring(r.raw.length);
          let s = t.at(-1);
          r.raw.length === 1 && s !== void 0 ? s.raw += `
` : t.push(r);
          continue;
        }
        if (r = this.tokenizer.code(e)) {
          e = e.substring(r.raw.length);
          let s = t.at(-1);
          s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.at(-1).src = s.text) : t.push(r);
          continue;
        }
        if (r = this.tokenizer.fences(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.heading(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.hr(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.blockquote(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.list(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.html(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.def(e)) {
          e = e.substring(r.raw.length);
          let s = t.at(-1);
          s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.raw, this.inlineQueue.at(-1).src = s.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title }, t.push(r));
          continue;
        }
        if (r = this.tokenizer.table(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.lheading(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        let i = e;
        if (this.options.extensions?.startBlock) {
          let s = 1 / 0, a = e.slice(1), o;
          this.options.extensions.startBlock.forEach((l) => {
            o = l.call({ lexer: this }, a), typeof o == "number" && o >= 0 && (s = Math.min(s, o));
          }), s < 1 / 0 && s >= 0 && (i = e.substring(0, s + 1));
        }
        if (this.state.top && (r = this.tokenizer.paragraph(i))) {
          let s = t.at(-1);
          n && s?.type === "paragraph" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(r), n = i.length !== e.length, e = e.substring(r.raw.length);
          continue;
        }
        if (r = this.tokenizer.text(e)) {
          e = e.substring(r.raw.length);
          let s = t.at(-1);
          s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(r);
          continue;
        }
        if (e) {
          let s = "Infinite loop on byte: " + e.charCodeAt(0);
          if (this.options.silent) {
            console.error(s);
            break;
          } else throw new Error(s);
        }
      }
      return this.state.top = true, t;
    }
    inline(e, t = []) {
      return this.inlineQueue.push({ src: e, tokens: t }), t;
    }
    inlineTokens(e, t = []) {
      let n = e, r = null;
      if (this.tokens.links) {
        let o = Object.keys(this.tokens.links);
        if (o.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; ) o.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
      }
      for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; ) n = n.slice(0, r.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
      let i;
      for (; (r = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; ) i = r[2] ? r[2].length : 0, n = n.slice(0, r.index + i) + "[" + "a".repeat(r[0].length - i - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
      n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
      let s = false, a = "";
      for (; e; ) {
        s || (a = ""), s = false;
        let o;
        if (this.options.extensions?.inline?.some((p) => (o = p.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), true) : false)) continue;
        if (o = this.tokenizer.escape(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.tag(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.link(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.reflink(e, this.tokens.links)) {
          e = e.substring(o.raw.length);
          let p = t.at(-1);
          o.type === "text" && p?.type === "text" ? (p.raw += o.raw, p.text += o.text) : t.push(o);
          continue;
        }
        if (o = this.tokenizer.emStrong(e, n, a)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.codespan(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.br(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.del(e, n, a)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.autolink(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (!this.state.inLink && (o = this.tokenizer.url(e))) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        let l = e;
        if (this.options.extensions?.startInline) {
          let p = 1 / 0, c = e.slice(1), d;
          this.options.extensions.startInline.forEach((h) => {
            d = h.call({ lexer: this }, c), typeof d == "number" && d >= 0 && (p = Math.min(p, d));
          }), p < 1 / 0 && p >= 0 && (l = e.substring(0, p + 1));
        }
        if (o = this.tokenizer.inlineText(l)) {
          e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (a = o.raw.slice(-1)), s = true;
          let p = t.at(-1);
          p?.type === "text" ? (p.raw += o.raw, p.text += o.text) : t.push(o);
          continue;
        }
        if (e) {
          let p = "Infinite loop on byte: " + e.charCodeAt(0);
          if (this.options.silent) {
            console.error(p);
            break;
          } else throw new Error(p);
        }
      }
      return t;
    }
  };
  var y = class {
    options;
    parser;
    constructor(e) {
      this.options = e || T;
    }
    space(e) {
      return "";
    }
    code({ text: e, lang: t, escaped: n }) {
      let r = (t || "").match(m.notSpaceStart)?.[0], i = e.replace(m.endingNewline, "") + `
`;
      return r ? '<pre><code class="language-' + O(r) + '">' + (n ? i : O(i, true)) + `</code></pre>
` : "<pre><code>" + (n ? i : O(i, true)) + `</code></pre>
`;
    }
    blockquote({ tokens: e }) {
      return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
    }
    html({ text: e }) {
      return e;
    }
    def(e) {
      return "";
    }
    heading({ tokens: e, depth: t }) {
      return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
    }
    hr(e) {
      return `<hr>
`;
    }
    list(e) {
      let t = e.ordered, n = e.start, r = "";
      for (let a = 0; a < e.items.length; a++) {
        let o = e.items[a];
        r += this.listitem(o);
      }
      let i = t ? "ol" : "ul", s = t && n !== 1 ? ' start="' + n + '"' : "";
      return "<" + i + s + `>
` + r + "</" + i + `>
`;
    }
    listitem(e) {
      return `<li>${this.parser.parse(e.tokens)}</li>
`;
    }
    checkbox({ checked: e }) {
      return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
    }
    paragraph({ tokens: e }) {
      return `<p>${this.parser.parseInline(e)}</p>
`;
    }
    table(e) {
      let t = "", n = "";
      for (let i = 0; i < e.header.length; i++) n += this.tablecell(e.header[i]);
      t += this.tablerow({ text: n });
      let r = "";
      for (let i = 0; i < e.rows.length; i++) {
        let s = e.rows[i];
        n = "";
        for (let a = 0; a < s.length; a++) n += this.tablecell(s[a]);
        r += this.tablerow({ text: n });
      }
      return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + r + `</table>
`;
    }
    tablerow({ text: e }) {
      return `<tr>
${e}</tr>
`;
    }
    tablecell(e) {
      let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
      return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
    }
    strong({ tokens: e }) {
      return `<strong>${this.parser.parseInline(e)}</strong>`;
    }
    em({ tokens: e }) {
      return `<em>${this.parser.parseInline(e)}</em>`;
    }
    codespan({ text: e }) {
      return `<code>${O(e, true)}</code>`;
    }
    br(e) {
      return "<br>";
    }
    del({ tokens: e }) {
      return `<del>${this.parser.parseInline(e)}</del>`;
    }
    link({ href: e, title: t, tokens: n }) {
      let r = this.parser.parseInline(n), i = X(e);
      if (i === null) return r;
      e = i;
      let s = '<a href="' + e + '"';
      return t && (s += ' title="' + O(t) + '"'), s += ">" + r + "</a>", s;
    }
    image({ href: e, title: t, text: n, tokens: r }) {
      r && (n = this.parser.parseInline(r, this.parser.textRenderer));
      let i = X(e);
      if (i === null) return O(n);
      e = i;
      let s = `<img src="${e}" alt="${O(n)}"`;
      return t && (s += ` title="${O(t)}"`), s += ">", s;
    }
    text(e) {
      return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : O(e.text);
    }
  };
  var $ = class {
    strong({ text: e }) {
      return e;
    }
    em({ text: e }) {
      return e;
    }
    codespan({ text: e }) {
      return e;
    }
    del({ text: e }) {
      return e;
    }
    html({ text: e }) {
      return e;
    }
    text({ text: e }) {
      return e;
    }
    link({ text: e }) {
      return "" + e;
    }
    image({ text: e }) {
      return "" + e;
    }
    br() {
      return "";
    }
    checkbox({ raw: e }) {
      return e;
    }
  };
  var b = class u2 {
    options;
    renderer;
    textRenderer;
    constructor(e) {
      this.options = e || T, this.options.renderer = this.options.renderer || new y(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new $();
    }
    static parse(e, t) {
      return new u2(t).parse(e);
    }
    static parseInline(e, t) {
      return new u2(t).parseInline(e);
    }
    parse(e) {
      let t = "";
      for (let n = 0; n < e.length; n++) {
        let r = e[n];
        if (this.options.extensions?.renderers?.[r.type]) {
          let s = r, a = this.options.extensions.renderers[s.type].call({ parser: this }, s);
          if (a !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(s.type)) {
            t += a || "";
            continue;
          }
        }
        let i = r;
        switch (i.type) {
          case "space": {
            t += this.renderer.space(i);
            break;
          }
          case "hr": {
            t += this.renderer.hr(i);
            break;
          }
          case "heading": {
            t += this.renderer.heading(i);
            break;
          }
          case "code": {
            t += this.renderer.code(i);
            break;
          }
          case "table": {
            t += this.renderer.table(i);
            break;
          }
          case "blockquote": {
            t += this.renderer.blockquote(i);
            break;
          }
          case "list": {
            t += this.renderer.list(i);
            break;
          }
          case "checkbox": {
            t += this.renderer.checkbox(i);
            break;
          }
          case "html": {
            t += this.renderer.html(i);
            break;
          }
          case "def": {
            t += this.renderer.def(i);
            break;
          }
          case "paragraph": {
            t += this.renderer.paragraph(i);
            break;
          }
          case "text": {
            t += this.renderer.text(i);
            break;
          }
          default: {
            let s = 'Token with "' + i.type + '" type was not found.';
            if (this.options.silent) return console.error(s), "";
            throw new Error(s);
          }
        }
      }
      return t;
    }
    parseInline(e, t = this.renderer) {
      let n = "";
      for (let r = 0; r < e.length; r++) {
        let i = e[r];
        if (this.options.extensions?.renderers?.[i.type]) {
          let a = this.options.extensions.renderers[i.type].call({ parser: this }, i);
          if (a !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
            n += a || "";
            continue;
          }
        }
        let s = i;
        switch (s.type) {
          case "escape": {
            n += t.text(s);
            break;
          }
          case "html": {
            n += t.html(s);
            break;
          }
          case "link": {
            n += t.link(s);
            break;
          }
          case "image": {
            n += t.image(s);
            break;
          }
          case "checkbox": {
            n += t.checkbox(s);
            break;
          }
          case "strong": {
            n += t.strong(s);
            break;
          }
          case "em": {
            n += t.em(s);
            break;
          }
          case "codespan": {
            n += t.codespan(s);
            break;
          }
          case "br": {
            n += t.br(s);
            break;
          }
          case "del": {
            n += t.del(s);
            break;
          }
          case "text": {
            n += t.text(s);
            break;
          }
          default: {
            let a = 'Token with "' + s.type + '" type was not found.';
            if (this.options.silent) return console.error(a), "";
            throw new Error(a);
          }
        }
      }
      return n;
    }
  };
  var P = class {
    options;
    block;
    constructor(e) {
      this.options = e || T;
    }
    static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
    static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
    preprocess(e) {
      return e;
    }
    postprocess(e) {
      return e;
    }
    processAllTokens(e) {
      return e;
    }
    emStrongMask(e) {
      return e;
    }
    provideLexer() {
      return this.block ? x.lex : x.lexInline;
    }
    provideParser() {
      return this.block ? b.parse : b.parseInline;
    }
  };
  var B = class {
    defaults = M();
    options = this.setOptions;
    parse = this.parseMarkdown(true);
    parseInline = this.parseMarkdown(false);
    Parser = b;
    Renderer = y;
    TextRenderer = $;
    Lexer = x;
    Tokenizer = w;
    Hooks = P;
    constructor(...e) {
      this.use(...e);
    }
    walkTokens(e, t) {
      let n = [];
      for (let r of e) switch (n = n.concat(t.call(this, r)), r.type) {
        case "table": {
          let i = r;
          for (let s of i.header) n = n.concat(this.walkTokens(s.tokens, t));
          for (let s of i.rows) for (let a of s) n = n.concat(this.walkTokens(a.tokens, t));
          break;
        }
        case "list": {
          let i = r;
          n = n.concat(this.walkTokens(i.items, t));
          break;
        }
        default: {
          let i = r;
          this.defaults.extensions?.childTokens?.[i.type] ? this.defaults.extensions.childTokens[i.type].forEach((s) => {
            let a = i[s].flat(1 / 0);
            n = n.concat(this.walkTokens(a, t));
          }) : i.tokens && (n = n.concat(this.walkTokens(i.tokens, t)));
        }
      }
      return n;
    }
    use(...e) {
      let t = this.defaults.extensions || { renderers: {}, childTokens: {} };
      return e.forEach((n) => {
        let r = { ...n };
        if (r.async = this.defaults.async || r.async || false, n.extensions && (n.extensions.forEach((i) => {
          if (!i.name) throw new Error("extension name required");
          if ("renderer" in i) {
            let s = t.renderers[i.name];
            s ? t.renderers[i.name] = function(...a) {
              let o = i.renderer.apply(this, a);
              return o === false && (o = s.apply(this, a)), o;
            } : t.renderers[i.name] = i.renderer;
          }
          if ("tokenizer" in i) {
            if (!i.level || i.level !== "block" && i.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
            let s = t[i.level];
            s ? s.unshift(i.tokenizer) : t[i.level] = [i.tokenizer], i.start && (i.level === "block" ? t.startBlock ? t.startBlock.push(i.start) : t.startBlock = [i.start] : i.level === "inline" && (t.startInline ? t.startInline.push(i.start) : t.startInline = [i.start]));
          }
          "childTokens" in i && i.childTokens && (t.childTokens[i.name] = i.childTokens);
        }), r.extensions = t), n.renderer) {
          let i = this.defaults.renderer || new y(this.defaults);
          for (let s in n.renderer) {
            if (!(s in i)) throw new Error(`renderer '${s}' does not exist`);
            if (["options", "parser"].includes(s)) continue;
            let a = s, o = n.renderer[a], l = i[a];
            i[a] = (...p) => {
              let c = o.apply(i, p);
              return c === false && (c = l.apply(i, p)), c || "";
            };
          }
          r.renderer = i;
        }
        if (n.tokenizer) {
          let i = this.defaults.tokenizer || new w(this.defaults);
          for (let s in n.tokenizer) {
            if (!(s in i)) throw new Error(`tokenizer '${s}' does not exist`);
            if (["options", "rules", "lexer"].includes(s)) continue;
            let a = s, o = n.tokenizer[a], l = i[a];
            i[a] = (...p) => {
              let c = o.apply(i, p);
              return c === false && (c = l.apply(i, p)), c;
            };
          }
          r.tokenizer = i;
        }
        if (n.hooks) {
          let i = this.defaults.hooks || new P();
          for (let s in n.hooks) {
            if (!(s in i)) throw new Error(`hook '${s}' does not exist`);
            if (["options", "block"].includes(s)) continue;
            let a = s, o = n.hooks[a], l = i[a];
            P.passThroughHooks.has(s) ? i[a] = (p) => {
              if (this.defaults.async && P.passThroughHooksRespectAsync.has(s)) return (async () => {
                let d = await o.call(i, p);
                return l.call(i, d);
              })();
              let c = o.call(i, p);
              return l.call(i, c);
            } : i[a] = (...p) => {
              if (this.defaults.async) return (async () => {
                let d = await o.apply(i, p);
                return d === false && (d = await l.apply(i, p)), d;
              })();
              let c = o.apply(i, p);
              return c === false && (c = l.apply(i, p)), c;
            };
          }
          r.hooks = i;
        }
        if (n.walkTokens) {
          let i = this.defaults.walkTokens, s = n.walkTokens;
          r.walkTokens = function(a) {
            let o = [];
            return o.push(s.call(this, a)), i && (o = o.concat(i.call(this, a))), o;
          };
        }
        this.defaults = { ...this.defaults, ...r };
      }), this;
    }
    setOptions(e) {
      return this.defaults = { ...this.defaults, ...e }, this;
    }
    lexer(e, t) {
      return x.lex(e, t ?? this.defaults);
    }
    parser(e, t) {
      return b.parse(e, t ?? this.defaults);
    }
    parseMarkdown(e) {
      return (n, r) => {
        let i = { ...r }, s = { ...this.defaults, ...i }, a = this.onError(!!s.silent, !!s.async);
        if (this.defaults.async === true && i.async === false) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
        if (typeof n > "u" || n === null) return a(new Error("marked(): input parameter is undefined or null"));
        if (typeof n != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
        if (s.hooks && (s.hooks.options = s, s.hooks.block = e), s.async) return (async () => {
          let o = s.hooks ? await s.hooks.preprocess(n) : n, p = await (s.hooks ? await s.hooks.provideLexer() : e ? x.lex : x.lexInline)(o, s), c = s.hooks ? await s.hooks.processAllTokens(p) : p;
          s.walkTokens && await Promise.all(this.walkTokens(c, s.walkTokens));
          let h = await (s.hooks ? await s.hooks.provideParser() : e ? b.parse : b.parseInline)(c, s);
          return s.hooks ? await s.hooks.postprocess(h) : h;
        })().catch(a);
        try {
          s.hooks && (n = s.hooks.preprocess(n));
          let l = (s.hooks ? s.hooks.provideLexer() : e ? x.lex : x.lexInline)(n, s);
          s.hooks && (l = s.hooks.processAllTokens(l)), s.walkTokens && this.walkTokens(l, s.walkTokens);
          let c = (s.hooks ? s.hooks.provideParser() : e ? b.parse : b.parseInline)(l, s);
          return s.hooks && (c = s.hooks.postprocess(c)), c;
        } catch (o) {
          return a(o);
        }
      };
    }
    onError(e, t) {
      return (n) => {
        if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
          let r = "<p>An error occurred:</p><pre>" + O(n.message + "", true) + "</pre>";
          return t ? Promise.resolve(r) : r;
        }
        if (t) return Promise.reject(n);
        throw n;
      };
    }
  };
  var L = new B();
  function g(u3, e) {
    return L.parse(u3, e);
  }
  g.options = g.setOptions = function(u3) {
    return L.setOptions(u3), g.defaults = L.defaults, G(g.defaults), g;
  };
  g.getDefaults = M;
  g.defaults = T;
  g.use = function(...u3) {
    return L.use(...u3), g.defaults = L.defaults, G(g.defaults), g;
  };
  g.walkTokens = function(u3, e) {
    return L.walkTokens(u3, e);
  };
  g.parseInline = L.parseInline;
  g.Parser = b;
  g.parser = b.parse;
  g.Renderer = y;
  g.TextRenderer = $;
  g.Lexer = x;
  g.lexer = x.lex;
  g.Tokenizer = w;
  g.Hooks = P;
  g.parse = g;
  var Ut = g.options;
  var Kt = g.setOptions;
  var Wt = g.use;
  var Xt = g.walkTokens;
  var Jt = g.parseInline;
  var Yt = b.parse;
  var en = x.lex;

  // node_modules/dompurify/dist/purify.es.mjs
  var {
    entries,
    setPrototypeOf,
    isFrozen,
    getPrototypeOf,
    getOwnPropertyDescriptor
  } = Object;
  var {
    freeze,
    seal,
    create
  } = Object;
  var {
    apply,
    construct
  } = typeof Reflect !== "undefined" && Reflect;
  if (!freeze) {
    freeze = function freeze2(x2) {
      return x2;
    };
  }
  if (!seal) {
    seal = function seal2(x2) {
      return x2;
    };
  }
  if (!apply) {
    apply = function apply2(func, thisArg) {
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }
      return func.apply(thisArg, args);
    };
  }
  if (!construct) {
    construct = function construct2(Func) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
      return new Func(...args);
    };
  }
  var arrayForEach = unapply(Array.prototype.forEach);
  var arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
  var arrayPop = unapply(Array.prototype.pop);
  var arrayPush = unapply(Array.prototype.push);
  var arraySplice = unapply(Array.prototype.splice);
  var stringToLowerCase = unapply(String.prototype.toLowerCase);
  var stringToString = unapply(String.prototype.toString);
  var stringMatch = unapply(String.prototype.match);
  var stringReplace = unapply(String.prototype.replace);
  var stringIndexOf = unapply(String.prototype.indexOf);
  var stringTrim = unapply(String.prototype.trim);
  var objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
  var regExpTest = unapply(RegExp.prototype.test);
  var typeErrorCreate = unconstruct(TypeError);
  function unapply(func) {
    return function(thisArg) {
      if (thisArg instanceof RegExp) {
        thisArg.lastIndex = 0;
      }
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }
      return apply(func, thisArg, args);
    };
  }
  function unconstruct(Func) {
    return function() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      return construct(Func, args);
    };
  }
  function addToSet(set, array) {
    let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
    if (setPrototypeOf) {
      setPrototypeOf(set, null);
    }
    let l = array.length;
    while (l--) {
      let element = array[l];
      if (typeof element === "string") {
        const lcElement = transformCaseFunc(element);
        if (lcElement !== element) {
          if (!isFrozen(array)) {
            array[l] = lcElement;
          }
          element = lcElement;
        }
      }
      set[element] = true;
    }
    return set;
  }
  function cleanArray(array) {
    for (let index = 0; index < array.length; index++) {
      const isPropertyExist = objectHasOwnProperty(array, index);
      if (!isPropertyExist) {
        array[index] = null;
      }
    }
    return array;
  }
  function clone(object) {
    const newObject = create(null);
    for (const [property, value] of entries(object)) {
      const isPropertyExist = objectHasOwnProperty(object, property);
      if (isPropertyExist) {
        if (Array.isArray(value)) {
          newObject[property] = cleanArray(value);
        } else if (value && typeof value === "object" && value.constructor === Object) {
          newObject[property] = clone(value);
        } else {
          newObject[property] = value;
        }
      }
    }
    return newObject;
  }
  function lookupGetter(object, prop) {
    while (object !== null) {
      const desc = getOwnPropertyDescriptor(object, prop);
      if (desc) {
        if (desc.get) {
          return unapply(desc.get);
        }
        if (typeof desc.value === "function") {
          return unapply(desc.value);
        }
      }
      object = getPrototypeOf(object);
    }
    function fallbackValue() {
      return null;
    }
    return fallbackValue;
  }
  var html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
  var svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
  var svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
  var svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
  var mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
  var mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
  var text = freeze(["#text"]);
  var html = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]);
  var svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
  var mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
  var xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
  var MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm);
  var ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
  var TMPLIT_EXPR = seal(/\$\{[\w\W]*/gm);
  var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
  var ARIA_ATTR = seal(/^aria-[\-\w]+$/);
  var IS_ALLOWED_URI = seal(
    /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
    // eslint-disable-line no-useless-escape
  );
  var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
  var ATTR_WHITESPACE = seal(
    /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
    // eslint-disable-line no-control-regex
  );
  var DOCTYPE_NAME = seal(/^html$/i);
  var CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
  var EXPRESSIONS = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    ARIA_ATTR,
    ATTR_WHITESPACE,
    CUSTOM_ELEMENT,
    DATA_ATTR,
    DOCTYPE_NAME,
    ERB_EXPR,
    IS_ALLOWED_URI,
    IS_SCRIPT_OR_DATA,
    MUSTACHE_EXPR,
    TMPLIT_EXPR
  });
  var NODE_TYPE = {
    element: 1,
    attribute: 2,
    text: 3,
    cdataSection: 4,
    entityReference: 5,
    // Deprecated
    entityNode: 6,
    // Deprecated
    progressingInstruction: 7,
    comment: 8,
    document: 9,
    documentType: 10,
    documentFragment: 11,
    notation: 12
    // Deprecated
  };
  var getGlobal = function getGlobal2() {
    return typeof window === "undefined" ? null : window;
  };
  var _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
    if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") {
      return null;
    }
    let suffix = null;
    const ATTR_NAME = "data-tt-policy-suffix";
    if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
      suffix = purifyHostElement.getAttribute(ATTR_NAME);
    }
    const policyName = "dompurify" + (suffix ? "#" + suffix : "");
    try {
      return trustedTypes.createPolicy(policyName, {
        createHTML(html2) {
          return html2;
        },
        createScriptURL(scriptUrl) {
          return scriptUrl;
        }
      });
    } catch (_2) {
      console.warn("TrustedTypes policy " + policyName + " could not be created.");
      return null;
    }
  };
  var _createHooksMap = function _createHooksMap2() {
    return {
      afterSanitizeAttributes: [],
      afterSanitizeElements: [],
      afterSanitizeShadowDOM: [],
      beforeSanitizeAttributes: [],
      beforeSanitizeElements: [],
      beforeSanitizeShadowDOM: [],
      uponSanitizeAttribute: [],
      uponSanitizeElement: [],
      uponSanitizeShadowNode: []
    };
  };
  function createDOMPurify() {
    let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
    const DOMPurify = (root) => createDOMPurify(root);
    DOMPurify.version = "3.3.3";
    DOMPurify.removed = [];
    if (!window2 || !window2.document || window2.document.nodeType !== NODE_TYPE.document || !window2.Element) {
      DOMPurify.isSupported = false;
      return DOMPurify;
    }
    let {
      document: document2
    } = window2;
    const originalDocument = document2;
    const currentScript = originalDocument.currentScript;
    const {
      DocumentFragment,
      HTMLTemplateElement,
      Node,
      Element,
      NodeFilter: NodeFilter2,
      NamedNodeMap = window2.NamedNodeMap || window2.MozNamedAttrMap,
      HTMLFormElement,
      DOMParser,
      trustedTypes
    } = window2;
    const ElementPrototype = Element.prototype;
    const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
    const remove = lookupGetter(ElementPrototype, "remove");
    const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
    const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
    const getParentNode = lookupGetter(ElementPrototype, "parentNode");
    if (typeof HTMLTemplateElement === "function") {
      const template = document2.createElement("template");
      if (template.content && template.content.ownerDocument) {
        document2 = template.content.ownerDocument;
      }
    }
    let trustedTypesPolicy;
    let emptyHTML = "";
    const {
      implementation,
      createNodeIterator,
      createDocumentFragment,
      getElementsByTagName
    } = document2;
    const {
      importNode
    } = originalDocument;
    let hooks = _createHooksMap();
    DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
    const {
      MUSTACHE_EXPR: MUSTACHE_EXPR2,
      ERB_EXPR: ERB_EXPR2,
      TMPLIT_EXPR: TMPLIT_EXPR2,
      DATA_ATTR: DATA_ATTR2,
      ARIA_ATTR: ARIA_ATTR2,
      IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA2,
      ATTR_WHITESPACE: ATTR_WHITESPACE2,
      CUSTOM_ELEMENT: CUSTOM_ELEMENT2
    } = EXPRESSIONS;
    let {
      IS_ALLOWED_URI: IS_ALLOWED_URI$1
    } = EXPRESSIONS;
    let ALLOWED_TAGS = null;
    const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
    let ALLOWED_ATTR = null;
    const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
    let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
      tagNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      allowCustomizedBuiltInElements: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: false
      }
    }));
    let FORBID_TAGS = null;
    let FORBID_ATTR = null;
    const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
      tagCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      }
    }));
    let ALLOW_ARIA_ATTR = true;
    let ALLOW_DATA_ATTR = true;
    let ALLOW_UNKNOWN_PROTOCOLS = false;
    let ALLOW_SELF_CLOSE_IN_ATTR = true;
    let SAFE_FOR_TEMPLATES = false;
    let SAFE_FOR_XML = true;
    let WHOLE_DOCUMENT = false;
    let SET_CONFIG = false;
    let FORCE_BODY = false;
    let RETURN_DOM = false;
    let RETURN_DOM_FRAGMENT = false;
    let RETURN_TRUSTED_TYPE = false;
    let SANITIZE_DOM = true;
    let SANITIZE_NAMED_PROPS = false;
    const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
    let KEEP_CONTENT = true;
    let IN_PLACE = false;
    let USE_PROFILES = {};
    let FORBID_CONTENTS = null;
    const DEFAULT_FORBID_CONTENTS = addToSet({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
    let DATA_URI_TAGS = null;
    const DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
    let URI_SAFE_ATTRIBUTES = null;
    const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
    const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
    const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
    let NAMESPACE = HTML_NAMESPACE;
    let IS_EMPTY_INPUT = false;
    let ALLOWED_NAMESPACES = null;
    const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
    let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ["mi", "mo", "mn", "ms", "mtext"]);
    let HTML_INTEGRATION_POINTS = addToSet({}, ["annotation-xml"]);
    const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
    let PARSER_MEDIA_TYPE = null;
    const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
    const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
    let transformCaseFunc = null;
    let CONFIG = null;
    const formElement = document2.createElement("form");
    const isRegexOrFunction = function isRegexOrFunction2(testValue) {
      return testValue instanceof RegExp || testValue instanceof Function;
    };
    const _parseConfig = function _parseConfig2() {
      let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      if (CONFIG && CONFIG === cfg) {
        return;
      }
      if (!cfg || typeof cfg !== "object") {
        cfg = {};
      }
      cfg = clone(cfg);
      PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
      SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
      transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
      ALLOWED_TAGS = objectHasOwnProperty(cfg, "ALLOWED_TAGS") ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
      ALLOWED_ATTR = objectHasOwnProperty(cfg, "ALLOWED_ATTR") ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
      ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, "ALLOWED_NAMESPACES") ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
      URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR, transformCaseFunc) : DEFAULT_URI_SAFE_ATTRIBUTES;
      DATA_URI_TAGS = objectHasOwnProperty(cfg, "ADD_DATA_URI_TAGS") ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS, transformCaseFunc) : DEFAULT_DATA_URI_TAGS;
      FORBID_CONTENTS = objectHasOwnProperty(cfg, "FORBID_CONTENTS") ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
      FORBID_TAGS = objectHasOwnProperty(cfg, "FORBID_TAGS") ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : clone({});
      FORBID_ATTR = objectHasOwnProperty(cfg, "FORBID_ATTR") ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : clone({});
      USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES : false;
      ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
      ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
      ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
      ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
      SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
      SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
      WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
      RETURN_DOM = cfg.RETURN_DOM || false;
      RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
      RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
      FORCE_BODY = cfg.FORCE_BODY || false;
      SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
      SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
      KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
      IN_PLACE = cfg.IN_PLACE || false;
      IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
      NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
      MATHML_TEXT_INTEGRATION_POINTS = cfg.MATHML_TEXT_INTEGRATION_POINTS || MATHML_TEXT_INTEGRATION_POINTS;
      HTML_INTEGRATION_POINTS = cfg.HTML_INTEGRATION_POINTS || HTML_INTEGRATION_POINTS;
      CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
      if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
      }
      if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
      }
      if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === "boolean") {
        CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
      }
      if (SAFE_FOR_TEMPLATES) {
        ALLOW_DATA_ATTR = false;
      }
      if (RETURN_DOM_FRAGMENT) {
        RETURN_DOM = true;
      }
      if (USE_PROFILES) {
        ALLOWED_TAGS = addToSet({}, text);
        ALLOWED_ATTR = create(null);
        if (USE_PROFILES.html === true) {
          addToSet(ALLOWED_TAGS, html$1);
          addToSet(ALLOWED_ATTR, html);
        }
        if (USE_PROFILES.svg === true) {
          addToSet(ALLOWED_TAGS, svg$1);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.svgFilters === true) {
          addToSet(ALLOWED_TAGS, svgFilters);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.mathMl === true) {
          addToSet(ALLOWED_TAGS, mathMl$1);
          addToSet(ALLOWED_ATTR, mathMl);
          addToSet(ALLOWED_ATTR, xml);
        }
      }
      if (!objectHasOwnProperty(cfg, "ADD_TAGS")) {
        EXTRA_ELEMENT_HANDLING.tagCheck = null;
      }
      if (!objectHasOwnProperty(cfg, "ADD_ATTR")) {
        EXTRA_ELEMENT_HANDLING.attributeCheck = null;
      }
      if (cfg.ADD_TAGS) {
        if (typeof cfg.ADD_TAGS === "function") {
          EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
        } else {
          if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
            ALLOWED_TAGS = clone(ALLOWED_TAGS);
          }
          addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
        }
      }
      if (cfg.ADD_ATTR) {
        if (typeof cfg.ADD_ATTR === "function") {
          EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
        } else {
          if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
            ALLOWED_ATTR = clone(ALLOWED_ATTR);
          }
          addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
        }
      }
      if (cfg.ADD_URI_SAFE_ATTR) {
        addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
      }
      if (cfg.FORBID_CONTENTS) {
        if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
          FORBID_CONTENTS = clone(FORBID_CONTENTS);
        }
        addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
      }
      if (cfg.ADD_FORBID_CONTENTS) {
        if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
          FORBID_CONTENTS = clone(FORBID_CONTENTS);
        }
        addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
      }
      if (KEEP_CONTENT) {
        ALLOWED_TAGS["#text"] = true;
      }
      if (WHOLE_DOCUMENT) {
        addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
      }
      if (ALLOWED_TAGS.table) {
        addToSet(ALLOWED_TAGS, ["tbody"]);
        delete FORBID_TAGS.tbody;
      }
      if (cfg.TRUSTED_TYPES_POLICY) {
        if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") {
          throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        }
        if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") {
          throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        }
        trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
        emptyHTML = trustedTypesPolicy.createHTML("");
      } else {
        if (trustedTypesPolicy === void 0) {
          trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
        }
        if (trustedTypesPolicy !== null && typeof emptyHTML === "string") {
          emptyHTML = trustedTypesPolicy.createHTML("");
        }
      }
      if (freeze) {
        freeze(cfg);
      }
      CONFIG = cfg;
    };
    const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
    const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
    const _checkValidNamespace = function _checkValidNamespace2(element) {
      let parent = getParentNode(element);
      if (!parent || !parent.tagName) {
        parent = {
          namespaceURI: NAMESPACE,
          tagName: "template"
        };
      }
      const tagName = stringToLowerCase(element.tagName);
      const parentTagName = stringToLowerCase(parent.tagName);
      if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
        return false;
      }
      if (element.namespaceURI === SVG_NAMESPACE) {
        if (parent.namespaceURI === HTML_NAMESPACE) {
          return tagName === "svg";
        }
        if (parent.namespaceURI === MATHML_NAMESPACE) {
          return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
        }
        return Boolean(ALL_SVG_TAGS[tagName]);
      }
      if (element.namespaceURI === MATHML_NAMESPACE) {
        if (parent.namespaceURI === HTML_NAMESPACE) {
          return tagName === "math";
        }
        if (parent.namespaceURI === SVG_NAMESPACE) {
          return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
        }
        return Boolean(ALL_MATHML_TAGS[tagName]);
      }
      if (element.namespaceURI === HTML_NAMESPACE) {
        if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
          return false;
        }
        if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
          return false;
        }
        return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
      }
      if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
        return true;
      }
      return false;
    };
    const _forceRemove = function _forceRemove2(node) {
      arrayPush(DOMPurify.removed, {
        element: node
      });
      try {
        getParentNode(node).removeChild(node);
      } catch (_2) {
        remove(node);
      }
    };
    const _removeAttribute = function _removeAttribute2(name, element) {
      try {
        arrayPush(DOMPurify.removed, {
          attribute: element.getAttributeNode(name),
          from: element
        });
      } catch (_2) {
        arrayPush(DOMPurify.removed, {
          attribute: null,
          from: element
        });
      }
      element.removeAttribute(name);
      if (name === "is") {
        if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
          try {
            _forceRemove(element);
          } catch (_2) {
          }
        } else {
          try {
            element.setAttribute(name, "");
          } catch (_2) {
          }
        }
      }
    };
    const _initDocument = function _initDocument2(dirty) {
      let doc = null;
      let leadingWhitespace = null;
      if (FORCE_BODY) {
        dirty = "<remove></remove>" + dirty;
      } else {
        const matches = stringMatch(dirty, /^[\r\n\t ]+/);
        leadingWhitespace = matches && matches[0];
      }
      if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
        dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
      }
      const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
      if (NAMESPACE === HTML_NAMESPACE) {
        try {
          doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
        } catch (_2) {
        }
      }
      if (!doc || !doc.documentElement) {
        doc = implementation.createDocument(NAMESPACE, "template", null);
        try {
          doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
        } catch (_2) {
        }
      }
      const body = doc.body || doc.documentElement;
      if (dirty && leadingWhitespace) {
        body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
      }
      if (NAMESPACE === HTML_NAMESPACE) {
        return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
      }
      return WHOLE_DOCUMENT ? doc.documentElement : body;
    };
    const _createNodeIterator = function _createNodeIterator2(root) {
      return createNodeIterator.call(
        root.ownerDocument || root,
        root,
        // eslint-disable-next-line no-bitwise
        NodeFilter2.SHOW_ELEMENT | NodeFilter2.SHOW_COMMENT | NodeFilter2.SHOW_TEXT | NodeFilter2.SHOW_PROCESSING_INSTRUCTION | NodeFilter2.SHOW_CDATA_SECTION,
        null
      );
    };
    const _isClobbered = function _isClobbered2(element) {
      return element instanceof HTMLFormElement && (typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || !(element.attributes instanceof NamedNodeMap) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function");
    };
    const _isNode = function _isNode2(value) {
      return typeof Node === "function" && value instanceof Node;
    };
    function _executeHooks(hooks2, currentNode, data) {
      arrayForEach(hooks2, (hook) => {
        hook.call(DOMPurify, currentNode, data, CONFIG);
      });
    }
    const _sanitizeElements = function _sanitizeElements2(currentNode) {
      let content = null;
      _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      const tagName = transformCaseFunc(currentNode.nodeName);
      _executeHooks(hooks.uponSanitizeElement, currentNode, {
        tagName,
        allowedTags: ALLOWED_TAGS
      });
      if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w!]/g, currentNode.innerHTML) && regExpTest(/<[/\w!]/g, currentNode.textContent)) {
        _forceRemove(currentNode);
        return true;
      }
      if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
        _forceRemove(currentNode);
        return true;
      }
      if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
        _forceRemove(currentNode);
        return true;
      }
      if (!(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName])) {
        if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
          if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
            return false;
          }
          if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
            return false;
          }
        }
        if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
          const parentNode = getParentNode(currentNode) || currentNode.parentNode;
          const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
          if (childNodes && parentNode) {
            const childCount = childNodes.length;
            for (let i = childCount - 1; i >= 0; --i) {
              const childClone = cloneNode(childNodes[i], true);
              childClone.__removalCount = (currentNode.__removalCount || 0) + 1;
              parentNode.insertBefore(childClone, getNextSibling(currentNode));
            }
          }
        }
        _forceRemove(currentNode);
        return true;
      }
      if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }
      if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
        content = currentNode.textContent;
        arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
          content = stringReplace(content, expr, " ");
        });
        if (currentNode.textContent !== content) {
          arrayPush(DOMPurify.removed, {
            element: currentNode.cloneNode()
          });
          currentNode.textContent = content;
        }
      }
      _executeHooks(hooks.afterSanitizeElements, currentNode, null);
      return false;
    };
    const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
      if (FORBID_ATTR[lcName]) {
        return false;
      }
      if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
        return false;
      }
      if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR2, lcName)) ;
      else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR2, lcName)) ;
      else if (EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag)) ;
      else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
        if (
          // First condition does a very basic check if a) it's basically a valid custom element tagname AND
          // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
          _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)) || // Alternative, second condition checks if it's an `is`-attribute, AND
          // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))
        ) ;
        else {
          return false;
        }
      } else if (URI_SAFE_ATTRIBUTES[lcName]) ;
      else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
      else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) ;
      else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA2, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
      else if (value) {
        return false;
      } else ;
      return true;
    };
    const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
      return tagName !== "annotation-xml" && stringMatch(tagName, CUSTOM_ELEMENT2);
    };
    const _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
      _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
      const {
        attributes
      } = currentNode;
      if (!attributes || _isClobbered(currentNode)) {
        return;
      }
      const hookEvent = {
        attrName: "",
        attrValue: "",
        keepAttr: true,
        allowedAttributes: ALLOWED_ATTR,
        forceKeepAttr: void 0
      };
      let l = attributes.length;
      while (l--) {
        const attr = attributes[l];
        const {
          name,
          namespaceURI,
          value: attrValue
        } = attr;
        const lcName = transformCaseFunc(name);
        const initValue = attrValue;
        let value = name === "value" ? initValue : stringTrim(initValue);
        hookEvent.attrName = lcName;
        hookEvent.attrValue = value;
        hookEvent.keepAttr = true;
        hookEvent.forceKeepAttr = void 0;
        _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
        value = hookEvent.attrValue;
        if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name")) {
          _removeAttribute(name, currentNode);
          value = SANITIZE_NAMED_PROPS_PREFIX + value;
        }
        if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (lcName === "attributename" && stringMatch(value, "href")) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (hookEvent.forceKeepAttr) {
          continue;
        }
        if (!hookEvent.keepAttr) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (SAFE_FOR_TEMPLATES) {
          arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
            value = stringReplace(value, expr, " ");
          });
        }
        const lcTag = transformCaseFunc(currentNode.nodeName);
        if (!_isValidAttribute(lcTag, lcName, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function") {
          if (namespaceURI) ;
          else {
            switch (trustedTypes.getAttributeType(lcTag, lcName)) {
              case "TrustedHTML": {
                value = trustedTypesPolicy.createHTML(value);
                break;
              }
              case "TrustedScriptURL": {
                value = trustedTypesPolicy.createScriptURL(value);
                break;
              }
            }
          }
        }
        if (value !== initValue) {
          try {
            if (namespaceURI) {
              currentNode.setAttributeNS(namespaceURI, name, value);
            } else {
              currentNode.setAttribute(name, value);
            }
            if (_isClobbered(currentNode)) {
              _forceRemove(currentNode);
            } else {
              arrayPop(DOMPurify.removed);
            }
          } catch (_2) {
            _removeAttribute(name, currentNode);
          }
        }
      }
      _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
    };
    const _sanitizeShadowDOM = function _sanitizeShadowDOM2(fragment) {
      let shadowNode = null;
      const shadowIterator = _createNodeIterator(fragment);
      _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
      while (shadowNode = shadowIterator.nextNode()) {
        _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
        _sanitizeElements(shadowNode);
        _sanitizeAttributes(shadowNode);
        if (shadowNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM2(shadowNode.content);
        }
      }
      _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
    };
    DOMPurify.sanitize = function(dirty) {
      let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      let body = null;
      let importedNode = null;
      let currentNode = null;
      let returnNode = null;
      IS_EMPTY_INPUT = !dirty;
      if (IS_EMPTY_INPUT) {
        dirty = "<!-->";
      }
      if (typeof dirty !== "string" && !_isNode(dirty)) {
        if (typeof dirty.toString === "function") {
          dirty = dirty.toString();
          if (typeof dirty !== "string") {
            throw typeErrorCreate("dirty is not a string, aborting");
          }
        } else {
          throw typeErrorCreate("toString is not a function");
        }
      }
      if (!DOMPurify.isSupported) {
        return dirty;
      }
      if (!SET_CONFIG) {
        _parseConfig(cfg);
      }
      DOMPurify.removed = [];
      if (typeof dirty === "string") {
        IN_PLACE = false;
      }
      if (IN_PLACE) {
        if (dirty.nodeName) {
          const tagName = transformCaseFunc(dirty.nodeName);
          if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
            throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
          }
        }
      } else if (dirty instanceof Node) {
        body = _initDocument("<!---->");
        importedNode = body.ownerDocument.importNode(dirty, true);
        if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") {
          body = importedNode;
        } else if (importedNode.nodeName === "HTML") {
          body = importedNode;
        } else {
          body.appendChild(importedNode);
        }
      } else {
        if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
        dirty.indexOf("<") === -1) {
          return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
        }
        body = _initDocument(dirty);
        if (!body) {
          return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
        }
      }
      if (body && FORCE_BODY) {
        _forceRemove(body.firstChild);
      }
      const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
      while (currentNode = nodeIterator.nextNode()) {
        _sanitizeElements(currentNode);
        _sanitizeAttributes(currentNode);
        if (currentNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(currentNode.content);
        }
      }
      if (IN_PLACE) {
        return dirty;
      }
      if (RETURN_DOM) {
        if (RETURN_DOM_FRAGMENT) {
          returnNode = createDocumentFragment.call(body.ownerDocument);
          while (body.firstChild) {
            returnNode.appendChild(body.firstChild);
          }
        } else {
          returnNode = body;
        }
        if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
          returnNode = importNode.call(originalDocument, returnNode, true);
        }
        return returnNode;
      }
      let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
      if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
        serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
      }
      if (SAFE_FOR_TEMPLATES) {
        arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
          serializedHTML = stringReplace(serializedHTML, expr, " ");
        });
      }
      return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
    };
    DOMPurify.setConfig = function() {
      let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      _parseConfig(cfg);
      SET_CONFIG = true;
    };
    DOMPurify.clearConfig = function() {
      CONFIG = null;
      SET_CONFIG = false;
    };
    DOMPurify.isValidAttribute = function(tag, attr, value) {
      if (!CONFIG) {
        _parseConfig({});
      }
      const lcTag = transformCaseFunc(tag);
      const lcName = transformCaseFunc(attr);
      return _isValidAttribute(lcTag, lcName, value);
    };
    DOMPurify.addHook = function(entryPoint, hookFunction) {
      if (typeof hookFunction !== "function") {
        return;
      }
      arrayPush(hooks[entryPoint], hookFunction);
    };
    DOMPurify.removeHook = function(entryPoint, hookFunction) {
      if (hookFunction !== void 0) {
        const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
        return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
      }
      return arrayPop(hooks[entryPoint]);
    };
    DOMPurify.removeHooks = function(entryPoint) {
      hooks[entryPoint] = [];
    };
    DOMPurify.removeAllHooks = function() {
      hooks = _createHooksMap();
    };
    return DOMPurify;
  }
  var purify = createDOMPurify();

  // popup/renderMarkdown.mjs
  g.use({
    breaks: false,
    gfm: true
  });
  purify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
      node.setAttribute("rel", "noopener noreferrer");
    }
  });
  function escapePlainForHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function normalizeModelPlaintext(s) {
    return String(s).replace(/[\u200B-\u200D\uFEFF\u2060]/g, "").replace(/\u00A0/g, " ");
  }
  function isMarkdownBlockLikeLine(line) {
    const t = String(line || "");
    if (!t.trim()) return false;
    return /^(#{1,6}\s|>\s|[-*+]\s|\d+\.\s|```|~~~|\|.*\||-{3,}\s*$|\*{3,}\s*$|_{3,}\s*$)/.test(t.trim());
  }
  function looksLikeFragmentedFormulaText(text2) {
    const lines = String(text2).split("\n");
    if (lines.length < 5) return false;
    let nonEmpty = 0;
    let shortCount = 0;
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i].trim();
      if (!t) continue;
      nonEmpty += 1;
      if (t.length <= 2) shortCount += 1;
    }
    if (nonEmpty < 5) return false;
    return shortCount / nonEmpty >= 0.5;
  }
  function preserveSoftLineBreaksForParagraphs(markdown) {
    const source = String(markdown);
    if (!source.includes("\n")) return source;
    if (looksLikeFragmentedFormulaText(source)) return source;
    const lines = source.split("\n");
    let out = "";
    let inFence = false;
    let fenceMarker = "";
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      const next = i < lines.length - 1 ? lines[i + 1] : null;
      const nextTrimmed = next == null ? "" : next.trim();
      const fenceStart = trimmed.match(/^(```+|~~~+)/);
      if (fenceStart) {
        if (!inFence) {
          inFence = true;
          fenceMarker = fenceStart[1][0];
        } else if (fenceStart[1][0] === fenceMarker) {
          inFence = false;
          fenceMarker = "";
        }
        out += line;
        if (i < lines.length - 1) out += "\n";
        continue;
      }
      if (inFence || trimmed === "") {
        out += line;
        if (i < lines.length - 1) out += "\n";
        continue;
      }
      if (isMarkdownBlockLikeLine(trimmed)) {
        out += line;
        if (i < lines.length - 1) out += "\n";
        continue;
      }
      const nextIsParagraphLine = next != null && nextTrimmed !== "" && !isMarkdownBlockLikeLine(nextTrimmed);
      if (i === lines.length - 1 || !nextIsParagraphLine) {
        out += line;
        if (i < lines.length - 1) out += "\n";
        continue;
      }
      out += `${line}  
`;
    }
    return out;
  }
  function markdownToSafeHtml(markdown) {
    if (markdown == null) return "";
    const normalized = normalizeModelPlaintext(markdown);
    const s = preserveSoftLineBreaksForParagraphs(normalized);
    if (s === "") return "";
    let rawHtml;
    try {
      rawHtml = g.parse(s);
    } catch (_e2) {
      return purify.sanitize(`<pre class="md-parse-fallback">${escapePlainForHtml(s)}</pre>`);
    }
    if (typeof rawHtml !== "string") return "";
    return purify.sanitize(rawHtml, {
      ADD_ATTR: ["target"],
      ALLOW_DATA_ATTR: false
    });
  }

  // popup/app.js
  var SITE_NAMES = {
    doubao: "\u8C46\u5305",
    yuanbao: "\u5143\u5B9D",
    kimi: "Kimi",
    deepseek: "DeepSeek",
    gemini: "Gemini",
    grok: "Grok",
    yiyan: "\u6587\u5FC3\u4E00\u8A00"
  };
  var ALL_SITE_IDS = ["doubao", "yuanbao", "kimi", "deepseek", "gemini", "grok", "yiyan"];
  var customSiteOrder = null;
  var customPlatformOrder = null;
  function emptyConversationsBySite() {
    return { doubao: [], yuanbao: [], kimi: [], deepseek: [], gemini: [], grok: [], yiyan: [] };
  }
  var sessionListEl = document.getElementById("session-list");
  var chatColumnsEl = document.getElementById("chat-columns");
  var primaryChatMessagesEl = document.getElementById("chat-messages-primary");
  var compareChatMessagesEl = document.getElementById("chat-messages-compare");
  var compareChatColumnEl = document.getElementById("chat-column-compare");
  var compareSessionTitleEl = document.getElementById("compare-session-title");
  var currentSessionTitleEl = document.getElementById("current-session-title");
  var currentSessionSiteEl = document.getElementById("current-session-site");
  var storageStatsEl = document.getElementById("storage-stats");
  var selectToolbarEl = document.getElementById("select-toolbar");
  var selectAllCheckbox = document.getElementById("select-all-checkbox");
  var selectedCountEl = document.getElementById("selected-count");
  var promptInput = document.getElementById("prompt-input");
  var btnToggleSelector = document.getElementById("btn-toggle-selector");
  var targetSelectorPanel = document.getElementById("target-selector-panel");
  var targetCheckboxList = document.getElementById("target-checkbox-list");
  var selectAllTargetsCheckbox = document.getElementById("select-all-targets");
  var selectedTargetsEl = document.getElementById("selected-targets");
  var sendTargetHintEl = document.getElementById("send-target-hint");
  var sessionSearchInput = document.getElementById("session-search-input");
  var btnSessionSearch = document.getElementById("btn-session-search");
  var btnSessionSearchClear = document.getElementById("btn-session-search-clear");
  var btnOpenOfficialSite = document.getElementById("btn-open-official-site");
  var btnToggleCompare = document.getElementById("btn-toggle-compare");
  var btnPickCompare = document.getElementById("btn-pick-compare");
  var btnSelectMode = document.getElementById("btn-select-mode");
  var btnSessionManage = document.getElementById("btn-session-manage");
  var btnCancelSelect = document.getElementById("btn-cancel-select");
  var btnDoSummary = document.getElementById("btn-do-summary");
  var sessionManageToolbarEl = document.getElementById("session-manage-toolbar");
  var btnSessionManageCancel = document.getElementById("btn-session-manage-cancel");
  var btnSessionManageDelete = document.getElementById("btn-session-manage-delete");
  var btnSessionManageExport = document.getElementById("btn-session-manage-export");
  var sessionManageSelectedCountEl = document.getElementById("session-manage-selected-count");
  var btnSend = document.getElementById("btn-send");
  var btnNewSession = document.getElementById("btn-new-session");
  var sessionMenuPopoverEl = document.getElementById("session-menu-popover");
  var comparePickerPopoverEl = document.getElementById("compare-picker-popover");
  var comparePickerSearchInput = document.getElementById("compare-picker-search");
  var comparePickerListEl = document.getElementById("compare-picker-list");
  var conversationsBySite = emptyConversationsBySite();
  var activeSearchQuery = null;
  var filteredConversationsBySite = null;
  var primaryConversation = null;
  var compareConversation = null;
  var isCompareMode = false;
  var siteTabPresence = {};
  var isSelectMode = false;
  var selectedMessages = /* @__PURE__ */ new Map();
  var isSessionManageMode = false;
  var bulkSelectedConvIds = /* @__PURE__ */ new Set();
  var editingConvId = null;
  var sessionMenuOpenConvId = null;
  function syncSessionMenuPopoverPosition() {
    if (!sessionMenuPopoverEl) return;
    if (!sessionMenuOpenConvId) {
      sessionMenuPopoverEl.setAttribute("hidden", "");
      sessionMenuPopoverEl.setAttribute("aria-hidden", "true");
      return;
    }
    const sid = String(sessionMenuOpenConvId);
    const item = sessionListEl.querySelector(`.session-item[data-id="${CSS.escape(sid)}"]`);
    if (!item) {
      sessionMenuOpenConvId = null;
      sessionMenuPopoverEl.setAttribute("hidden", "");
      sessionMenuPopoverEl.setAttribute("aria-hidden", "true");
      return;
    }
    const renameBtn = sessionMenuPopoverEl.querySelector(".session-menu-rename");
    const delBtn = sessionMenuPopoverEl.querySelector(".session-menu-delete");
    if (renameBtn) renameBtn.dataset.id = sid;
    if (delBtn) delBtn.dataset.id = sid;
    sessionMenuPopoverEl.removeAttribute("hidden");
    sessionMenuPopoverEl.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => {
      if (!sessionMenuOpenConvId || String(sessionMenuOpenConvId) !== sid) return;
      const rect = item.getBoundingClientRect();
      const gap = 6;
      const pad = 6;
      const mw = sessionMenuPopoverEl.offsetWidth;
      const mh = sessionMenuPopoverEl.offsetHeight;
      let left = rect.right - mw;
      let top = rect.bottom + gap;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (left < pad) left = pad;
      if (left + mw > vw - pad) left = Math.max(pad, vw - pad - mw);
      if (top + mh > vh - pad) {
        top = rect.top - gap - mh;
      }
      if (top < pad) top = pad;
      sessionMenuPopoverEl.style.left = `${Math.round(left)}px`;
      sessionMenuPopoverEl.style.top = `${Math.round(top)}px`;
    });
  }
  var expandedSites = /* @__PURE__ */ new Set();
  var summaryStarSiteIds = /* @__PURE__ */ new Set();
  var pendingSummaryDispatch = false;
  var SUMMARY_PROMPT_PREFIX = "\u8BF7\u5BF9\u4EE5\u4E0B\u5BF9\u8BDD\u5185\u5BB9\u8FDB\u884C\u603B\u7ED3";
  var selectedTargetSites = /* @__PURE__ */ new Set();
  var refreshIntervalId = null;
  var _storageChangeDetected = false;
  var REFRESH_INTERVAL_MS = 5e3;
  function getMessageKey(siteId, convId, msgId) {
    return `${siteId}:${convId}:${msgId}`;
  }
  function resetPrimaryConversationView() {
    primaryConversation = null;
    currentSessionTitleEl.textContent = "\u9009\u62E9\u4E00\u4E2A\u6807\u7B7E\u67E5\u770B\u5BF9\u8BDD";
    currentSessionSiteEl.textContent = "";
    currentSessionSiteEl.className = "session-site-badge";
  }
  function escapeHtml(str) {
    if (str == null) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  var SEARCH_HIT_DELIMS = /* @__PURE__ */ new Set([
    ",",
    ".",
    "\uFF0C",
    "\u3002",
    "\uFF1B",
    "\uFF1F",
    "\uFF01",
    ";",
    "?",
    "!",
    "\n"
  ]);
  function findSearchHitInclusiveEnd(text2, matchStart) {
    const t = String(text2);
    const n = t.length;
    if (n === 0) return -1;
    if (matchStart >= n) return n - 1;
    for (let i = matchStart; i < n; i++) {
      if (SEARCH_HIT_DELIMS.has(t[i])) return i;
    }
    return n - 1;
  }
  function computeSearchHighlightRanges(text2, query) {
    if (query == null || query === "") return [];
    const q2 = String(query).toLowerCase();
    if (q2.length === 0) return [];
    const t = String(text2);
    const lower = t.toLowerCase();
    const raw = [];
    let pos = 0;
    let idx;
    while ((idx = lower.indexOf(q2, pos)) !== -1) {
      const end = findSearchHitInclusiveEnd(t, idx);
      raw.push([idx, Math.max(idx, end)]);
      pos = idx + 1;
    }
    if (raw.length === 0) return [];
    raw.sort((a, b2) => a[0] - b2[0]);
    const merged = [raw[0].slice()];
    for (let i = 1; i < raw.length; i++) {
      const s = raw[i][0];
      const e = raw[i][1];
      const last = merged[merged.length - 1];
      if (s <= last[1] + 1) {
        last[1] = Math.max(last[1], e);
      } else {
        merged.push([s, e]);
      }
    }
    return merged;
  }
  function plainTextToSearchHighlightedHtml(text2, query) {
    if (query == null || query === "") return escapeHtml(text2);
    const ranges = computeSearchHighlightRanges(text2, query);
    if (ranges.length === 0) return escapeHtml(text2);
    const t = String(text2);
    let out = "";
    let cursor = 0;
    for (let r = 0; r < ranges.length; r++) {
      const s = ranges[r][0];
      const e = ranges[r][1];
      out += escapeHtml(t.slice(cursor, s));
      out += '<mark class="search-hit">';
      out += escapeHtml(t.slice(s, e + 1));
      out += "</mark>";
      cursor = e + 1;
    }
    out += escapeHtml(t.slice(cursor));
    return out;
  }
  function highlightSearchInHtmlFragment(sanitizedHtml, query) {
    if (query == null || query === "") return sanitizedHtml;
    const html2 = String(sanitizedHtml);
    if (!html2) return html2;
    const div = document.createElement("div");
    div.innerHTML = html2;
    const walker = document.createTreeWalker(div, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      const pe2 = node.parentElement;
      if (pe2) {
        const tag = pe2.tagName;
        if (tag === "SCRIPT" || tag === "STYLE") continue;
      }
      textNodes.push(node);
    }
    for (let i = 0; i < textNodes.length; i++) {
      const tn = textNodes[i];
      if (!tn.parentNode) continue;
      const raw = tn.nodeValue;
      if (raw == null || raw === "") continue;
      const ranges = computeSearchHighlightRanges(raw, query);
      if (ranges.length === 0) continue;
      const inner = plainTextToSearchHighlightedHtml(raw, query);
      const wrap = document.createElement("span");
      wrap.innerHTML = inner;
      const parent = tn.parentNode;
      const frag = document.createDocumentFragment();
      while (wrap.firstChild) frag.appendChild(wrap.firstChild);
      parent.replaceChild(frag, tn);
    }
    return div.innerHTML;
  }
  function formatTime(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  function formatDate(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  function getConversationDisplayName(conv, firstUserMessage = "") {
    if (conv.customName && conv.customName.trim()) {
      return conv.customName.trim();
    }
    if (conv.title && conv.title.trim()) {
      return conv.title.trim();
    }
    if (firstUserMessage) {
      return firstUserMessage.slice(0, 20) + (firstUserMessage.length > 20 ? "..." : "");
    }
    return "\u672A\u547D\u540D\u5BF9\u8BDD";
  }
  async function sendMessage(msg) {
    return chrome.runtime.sendMessage(msg);
  }
  function showEphemeralHint(text2) {
    if (!sendTargetHintEl) return;
    sendTargetHintEl.textContent = text2;
    sendTargetHintEl.removeAttribute("hidden");
    clearTimeout(showEphemeralHint._tid);
    showEphemeralHint._tid = setTimeout(() => {
      sendTargetHintEl.textContent = "";
      sendTargetHintEl.setAttribute("hidden", "");
    }, 2200);
  }
  function findConversationMetaById(id) {
    const data = getConversationsForSidebar();
    for (const siteId of ALL_SITE_IDS) {
      const list = data[siteId] || [];
      const c = list.find((x2) => x2.id === id);
      if (c) return c;
    }
    return null;
  }
  function updateSessionManageToolbarChrome() {
    if (sessionManageSelectedCountEl) {
      sessionManageSelectedCountEl.textContent = `\u5DF2\u9009 ${bulkSelectedConvIds.size} \u4E2A\u4F1A\u8BDD`;
    }
    if (btnSessionManageDelete) {
      btnSessionManageDelete.disabled = bulkSelectedConvIds.size === 0;
    }
  }
  function conversationsDataEqual(oldData, newData) {
    for (const siteId of ALL_SITE_IDS) {
      const oldList = oldData[siteId] || [];
      const newList = newData[siteId] || [];
      if (oldList.length !== newList.length) return false;
      for (let i = 0; i < oldList.length; i++) {
        const oldConv = oldList[i];
        const newConv = newList[i];
        if (oldConv.id !== newConv.id || oldConv.customName !== newConv.customName || oldConv.title !== newConv.title || oldConv.url !== newConv.url || oldConv.updatedAt !== newConv.updatedAt || oldConv.messageCount !== newConv.messageCount) {
          return false;
        }
      }
    }
    return true;
  }
  function groupSearchResultsFlat(flat) {
    const out = emptyConversationsBySite();
    const list = Array.isArray(flat) ? flat : [];
    for (let i = 0; i < list.length; i++) {
      const c = list[i];
      if (c && c.siteId && out[c.siteId]) {
        out[c.siteId].push(c);
      }
    }
    for (const siteId of ALL_SITE_IDS) {
      out[siteId].sort((a, b2) => (b2.updatedAt || 0) - (a.updatedAt || 0));
    }
    return out;
  }
  function getConversationsForSidebar() {
    if (activeSearchQuery == null) return conversationsBySite;
    return filteredConversationsBySite || emptyConversationsBySite();
  }
  function getSortedSiteIds(orderType) {
    const customOrder = orderType === "session" ? customSiteOrder : customPlatformOrder;
    if (customOrder && Array.isArray(customOrder)) {
      return customOrder;
    }
    return ALL_SITE_IDS.slice();
  }
  function saveCustomSiteOrder(order) {
    customSiteOrder = order;
    chrome.storage.local.set({ polyChatSiteOrder: order }, () => {
      if (chrome.runtime.lastError) {
        console.error("[PolyChat] \u4FDD\u5B58\u7AD9\u70B9\u987A\u5E8F\u5931\u8D25:", chrome.runtime.lastError);
      }
    });
  }
  function saveCustomPlatformOrder(order) {
    customPlatformOrder = order;
    chrome.storage.local.set({ polyChatPlatformOrder: order }, () => {
      if (chrome.runtime.lastError) {
        console.error("[PolyChat] \u4FDD\u5B58\u5E73\u53F0\u987A\u5E8F\u5931\u8D25:", chrome.runtime.lastError);
      }
    });
  }
  async function loadCustomOrders() {
    try {
      const result = await chrome.storage.local.get(["polyChatSiteOrder", "polyChatPlatformOrder"]);
      if (result.polyChatSiteOrder && Array.isArray(result.polyChatSiteOrder)) {
        customSiteOrder = result.polyChatSiteOrder;
      }
      if (result.polyChatPlatformOrder && Array.isArray(result.polyChatPlatformOrder)) {
        customPlatformOrder = result.polyChatPlatformOrder;
      }
    } catch (e) {
      console.error("[PolyChat] \u52A0\u8F7D\u81EA\u5B9A\u4E49\u987A\u5E8F\u5931\u8D25:", e);
    }
  }
  function initDragAndDrop(container, orderType) {
    const saveOrder = orderType === "session" ? saveCustomSiteOrder : saveCustomPlatformOrder;
    const getOrder = () => getSortedSiteIds(orderType);
    const selector = orderType === "session" ? ".site-group-header" : ".target-checkbox-item";
    let draggedEl = null;
    let draggedSiteId = null;
    container.querySelectorAll(selector).forEach((el) => {
      el.addEventListener("dragstart", (e) => {
        draggedEl = el;
        draggedSiteId = el.dataset.dragSiteId || el.dataset.siteId;
        el.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", draggedSiteId);
      });
      el.addEventListener("dragend", () => {
        el.classList.remove("dragging");
        container.querySelectorAll(selector).forEach((item) => {
          item.classList.remove("drag-over");
        });
        draggedEl = null;
        draggedSiteId = null;
      });
      el.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        const targetEl = el.closest(selector);
        if (targetEl && targetEl !== draggedEl) {
          container.querySelectorAll(selector).forEach((item) => {
            item.classList.remove("drag-over");
          });
          targetEl.classList.add("drag-over");
        }
      });
      el.addEventListener("dragleave", () => {
        el.classList.remove("drag-over");
      });
      el.addEventListener("drop", (e) => {
        e.preventDefault();
        const targetEl = el.closest(selector);
        if (!targetEl || targetEl === draggedEl) return;
        const targetSiteId = targetEl.dataset.dragSiteId || targetEl.dataset.siteId;
        if (!draggedSiteId || !targetSiteId || draggedSiteId === targetSiteId) return;
        const currentOrder = getOrder();
        const fromIndex = currentOrder.indexOf(draggedSiteId);
        const toIndex = currentOrder.indexOf(targetSiteId);
        if (fromIndex === -1 || toIndex === -1) return;
        const newOrder = [...currentOrder];
        newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, draggedSiteId);
        saveOrder(newOrder);
        if (orderType === "session") {
          renderConversationList();
        } else {
          renderSendTargets();
        }
      });
    });
  }
  function updateSearchFilterChrome() {
    if (btnSessionSearchClear) {
      btnSessionSearchClear.style.display = activeSearchQuery != null ? "" : "none";
    }
  }
  async function runSessionSearch() {
    const raw = sessionSearchInput ? sessionSearchInput.value.trim() : "";
    if (!raw) {
      clearSessionSearchFilter();
      return;
    }
    try {
      const flat = await sendMessage({ type: "SEARCH_CONVERSATIONS", query: raw });
      activeSearchQuery = raw;
      filteredConversationsBySite = groupSearchResultsFlat(flat);
      updateSearchFilterChrome();
      renderConversationList();
      if (primaryConversation || compareConversation) renderChatPanels();
    } catch (e) {
      console.error("[Popup] \u641C\u7D22\u4F1A\u8BDD\u5931\u8D25:", e);
    }
  }
  function clearSessionSearchFilter() {
    activeSearchQuery = null;
    filteredConversationsBySite = null;
    if (sessionSearchInput) sessionSearchInput.value = "";
    updateSearchFilterChrome();
    renderConversationList();
    if (primaryConversation || compareConversation) renderChatPanels();
  }
  async function loadConversations(options = {}) {
    try {
      const result = await sendMessage({ type: "LIST_CONVERSATIONS" });
      const newConversationsBySite = result || emptyConversationsBySite();
      const hasDataChanged = !conversationsDataEqual(conversationsBySite, newConversationsBySite);
      conversationsBySite = newConversationsBySite;
      if (activeSearchQuery != null) {
        try {
          const flat = await sendMessage({ type: "SEARCH_CONVERSATIONS", query: activeSearchQuery });
          filteredConversationsBySite = groupSearchResultsFlat(flat);
        } catch (se2) {
          console.error("[Popup] \u4FDD\u6301\u7B5B\u9009\u65F6\u641C\u7D22\u5931\u8D25:", se2);
        }
      } else {
        filteredConversationsBySite = null;
      }
      const listNeverPainted = sessionListEl && sessionListEl.childElementCount === 0;
      const shouldRenderList = hasDataChanged || activeSearchQuery != null || listNeverPainted;
      if (shouldRenderList && editingConvId == null) {
        renderConversationList();
        _storageChangeDetected = false;
      }
      if (hasDataChanged || _storageChangeDetected || options.force) {
        updateStorageStats();
      }
      if (options.refreshCurrentConversation && (primaryConversation || compareConversation)) {
        let hasConversationChanged = false;
        if (primaryConversation) {
          const fullPrimary = await sendMessage({ type: "GET_CONVERSATION", id: primaryConversation.id });
          if (fullPrimary) {
            const oldMsgIds = primaryConversation.messages ? primaryConversation.messages.map((m2) => m2.id) : [];
            const newMsgIds = fullPrimary.messages ? fullPrimary.messages.map((m2) => m2.id) : [];
            const messagesChanged = JSON.stringify(oldMsgIds) !== JSON.stringify(newMsgIds) || JSON.stringify(primaryConversation.messages) !== JSON.stringify(fullPrimary.messages);
            if (messagesChanged) {
              primaryConversation = fullPrimary;
              hasConversationChanged = true;
            }
          }
        }
        if (compareConversation) {
          const fullCompare = await sendMessage({ type: "GET_CONVERSATION", id: compareConversation.id });
          if (fullCompare) {
            const oldMsgIds = compareConversation.messages ? compareConversation.messages.map((m2) => m2.id) : [];
            const newMsgIds = fullCompare.messages ? fullCompare.messages.map((m2) => m2.id) : [];
            const messagesChanged = JSON.stringify(oldMsgIds) !== JSON.stringify(newMsgIds) || JSON.stringify(compareConversation.messages) !== JSON.stringify(fullCompare.messages);
            if (messagesChanged) {
              compareConversation = fullCompare;
              hasConversationChanged = true;
            }
          }
        }
        if (hasConversationChanged) {
          renderChatPanels();
          if (!hasDataChanged) {
            renderConversationList();
          }
        }
      }
    } catch (e) {
      console.error("[Popup] \u52A0\u8F7D\u4F1A\u8BDD\u5931\u8D25:", e);
      sessionListEl.innerHTML = `<p class="empty-hint" style="color:var(--error);">\u52A0\u8F7D\u5931\u8D25</p>`;
    }
  }
  function startAutoRefresh() {
    if (refreshIntervalId) return;
    refreshIntervalId = setInterval(() => {
      loadConversations({ refreshCurrentConversation: true });
    }, REFRESH_INTERVAL_MS);
    console.log("[Popup] \u81EA\u52A8\u5237\u65B0\u5DF2\u542F\u52A8\uFF0C\u6BCF", REFRESH_INTERVAL_MS / 1e3, "\u79D2\u5237\u65B0\u4E00\u6B21");
  }
  function renderConversationList() {
    const siteLabels = SITE_NAMES;
    const data = getConversationsForSidebar();
    const sortedSiteIds = getSortedSiteIds("session");
    if (activeSearchQuery != null) {
      sortedSiteIds.forEach((siteId) => {
        const conversations = data[siteId] || [];
        if (conversations.length > 0) {
          expandedSites.add(siteId);
        }
      });
    }
    let html2 = "";
    for (const siteId of sortedSiteIds) {
      const conversations = data[siteId] || [];
      if (conversations.length === 0) {
        continue;
      }
      const isExpanded = expandedSites.has(siteId);
      const count = conversations.length;
      html2 += `
      <div class="site-group ${isExpanded ? "expanded" : ""}" data-site-id="${siteId}">
        <div class="site-group-header" draggable="true" data-drag-site-id="${siteId}">
          <span class="site-group-drag-handle">\u2630</span>
          <span class="site-group-toggle">\u25B8</span>
          <span class="site-group-icon ${siteId}"></span>
          <span class="site-group-name">${siteLabels[siteId] || siteId}</span>
          <span class="site-group-count">${count}</span>
        </div>
        <div class="site-group-items" ${isExpanded ? "" : 'style="display:none;"'}>
          ${conversations.map((conv) => {
        const name = getConversationDisplayName(conv, "");
        const nameInner = activeSearchQuery != null ? plainTextToSearchHighlightedHtml(name, activeSearchQuery) : escapeHtml(name);
        const isActive = primaryConversation && primaryConversation.id === conv.id;
        const prefix = `${siteId}:${conv.id}:`;
        const selectedCount = Array.from(selectedMessages.keys()).filter((k2) => k2.startsWith(prefix)).length;
        const selectedBadge = selectedCount > 0 ? `<span class="session-selected-badge">${selectedCount}</span>` : "";
        const hasUrl = !!(conv.url && String(conv.url).trim());
        const locateTitleRow = hasUrl ? "\u5728\u65B0\u6807\u7B7E\u9875\u6253\u5F00\u4FDD\u5B58\u7684\u9875\u9762" : "\u5C1A\u672A\u8BB0\u5F55\u9875\u9762\u5730\u5740\uFF0C\u8BF7\u5148\u5728\u5BF9\u5E94\u7F51\u7AD9\u6253\u5F00\u8FC7\u672C\u4F1A\u8BDD";
        const manageClass = isSessionManageMode ? " is-session-manage" : "";
        const menuOpenClass = sessionMenuOpenConvId === conv.id ? " session-menu-open" : "";
        const bulkWrapDisplay = isSessionManageMode ? "flex" : "none";
        const nameBlock = editingConvId === conv.id ? `<div class="session-name" title="\u7F16\u8F91\u540D\u79F0">
                    <input type="text" class="session-name-input" data-id="${escapeHtml(conv.id)}" value="${escapeHtml(name)}" autocomplete="off" />
                  </div>` : `<div class="session-name" title="${escapeHtml(name)}">
                    <span class="session-name-text">${nameInner}${selectedBadge}</span>
                  </div>`;
        return `
              <div class="session-item${isActive ? " active" : ""}${manageClass}${menuOpenClass}" data-id="${escapeHtml(conv.id)}">
                <label class="session-bulk-cb-wrap" style="display:${bulkWrapDisplay}">
                  <input type="checkbox" class="session-bulk-cb" data-id="${escapeHtml(conv.id)}" ${bulkSelectedConvIds.has(conv.id) ? "checked" : ""} />
                </label>
                <div class="session-body">
                  <div class="session-info">
                    ${nameBlock}
                    <div class="session-meta-row">
                      <span class="session-meta">${formatDate(conv.updatedAt)}</span>
                      <button type="button" class="btn-locate-origin" data-id="${escapeHtml(conv.id)}" title="${escapeHtml(locateTitleRow)}" ${hasUrl ? "" : "disabled"}>\u539F\u9875\u9762</button>
                    </div>
                  </div>
                  <div class="session-item-trailing">
                    <span class="session-count">${conv.messageCount || 0}\u6761</span>
                    <button type="button" class="session-more-btn" data-id="${escapeHtml(conv.id)}" title="\u66F4\u591A" aria-haspopup="true" aria-expanded="${sessionMenuOpenConvId === conv.id ? "true" : "false"}">\u22EE</button>
                  </div>
                </div>
              </div>
            `;
      }).join("")}
        </div>
      </div>
    `;
    }
    if (!html2) {
      html2 = '<p class="empty-hint">\u6682\u65E0\u5B58\u50A8\u7684\u5BF9\u8BDD</p>';
    }
    sessionListEl.innerHTML = html2;
    sessionListEl.querySelectorAll(".site-group-header").forEach((header) => {
      header.addEventListener("click", (e) => {
        if (e.target.closest(".site-group-drag-handle")) return;
        const group = header.closest(".site-group");
        const siteId = group.dataset.siteId;
        const items = group.querySelector(".site-group-items");
        if (expandedSites.has(siteId)) {
          expandedSites.delete(siteId);
          group.classList.remove("expanded");
          items.style.display = "none";
        } else {
          expandedSites.add(siteId);
          group.classList.add("expanded");
          items.style.display = "";
        }
      });
    });
    initDragAndDrop(sessionListEl, "session");
    syncSessionMenuPopoverPosition();
  }
  async function selectConversation(id) {
    sessionMenuOpenConvId = null;
    syncSessionMenuPopoverPosition();
    try {
      let conv = null;
      for (const siteId of Object.keys(conversationsBySite)) {
        conv = (conversationsBySite[siteId] || []).find((c) => c.id === id);
        if (conv) break;
      }
      if (!conv) return;
      const fullConv = await sendMessage({ type: "GET_CONVERSATION", id });
      if (!fullConv) {
        return;
      }
      primaryConversation = fullConv;
      if (compareConversation && compareConversation.id === fullConv.id) {
        compareConversation = null;
      }
      let firstUserMessage = "";
      if (fullConv.messages && fullConv.messages.length > 0) {
        for (const msg of fullConv.messages) {
          if (msg.role === "user") {
            firstUserMessage = msg.content;
            break;
          }
        }
      }
      const name = getConversationDisplayName(fullConv, firstUserMessage);
      currentSessionTitleEl.textContent = name;
      currentSessionSiteEl.textContent = SITE_NAMES[fullConv.siteId] || fullConv.siteId;
      currentSessionSiteEl.className = `session-site-badge ${fullConv.siteId}`;
      updateSelectedCount();
      renderChatPanels();
      renderConversationList();
    } catch (e) {
      console.error("[Popup] \u52A0\u8F7D\u4F1A\u8BDD\u5931\u8D25:", e);
      primaryChatMessagesEl.innerHTML = '<p class="empty-hint" style="color:var(--error);">\u52A0\u8F7D\u5931\u8D25</p>';
    }
  }
  function renderChatPanels() {
    if (!chatColumnsEl) return;
    if (!isCompareMode) {
      chatColumnsEl.classList.remove("compare-on");
      if (compareChatColumnEl) compareChatColumnEl.hidden = true;
      if (btnPickCompare) btnPickCompare.style.display = "none";
      if (compareSessionTitleEl) compareSessionTitleEl.textContent = "";
      if (compareChatMessagesEl) compareChatMessagesEl.innerHTML = "";
      if (btnToggleCompare) btnToggleCompare.textContent = "\u5F00\u542F\u5BF9\u6BD4";
    } else {
      chatColumnsEl.classList.add("compare-on");
      if (compareChatColumnEl) compareChatColumnEl.hidden = false;
      if (btnPickCompare) btnPickCompare.style.display = "";
      if (btnToggleCompare) btnToggleCompare.textContent = "\u5173\u95ED\u5BF9\u6BD4";
    }
    renderConversationMessages(primaryConversation, primaryChatMessagesEl, { isComparePanel: false });
    if (isCompareMode) {
      renderConversationMessages(compareConversation, compareChatMessagesEl, { isComparePanel: true });
    }
    if (isCompareMode && compareSessionTitleEl) {
      if (!compareConversation) {
        compareSessionTitleEl.textContent = "\u672A\u9009\u62E9\u5BF9\u6BD4\u4F1A\u8BDD";
      } else {
        compareSessionTitleEl.textContent = getConversationDisplayName(compareConversation, "");
      }
    }
  }
  function renderConversationMessages(conversation, containerEl, { isComparePanel = false } = {}) {
    if (!containerEl) return;
    if (!conversation) {
      containerEl.innerHTML = `<p class="empty-hint">${isComparePanel ? "\u70B9\u51FB\u201C\u9009\u62E9\u5BF9\u6BD4\u4F1A\u8BDD\u201D\u67E5\u770B\u53E6\u4E00\u4E2AAI\u56DE\u7B54" : "\u9009\u62E9\u5DE6\u4FA7\u6807\u7B7E\u67E5\u770B\u5BF9\u8BDD\u5185\u5BB9"}</p>`;
      return;
    }
    if (!conversation.messages || !conversation.messages.length) {
      containerEl.innerHTML = '<p class="empty-hint">\u8BE5\u6807\u7B7E\u4E0B\u6682\u65E0\u5BF9\u8BDD\u5185\u5BB9</p>';
      return;
    }
    const searchQ = activeSearchQuery;
    const messages = getOrderedMessagesForDisplay(conversation);
    containerEl.innerHTML = messages.map((msg) => {
      const isUser = msg.role === "user";
      const roleLabel = isUser ? "\u{1F464}" : "\u{1F916}";
      const timeStr = formatTime(msg.timestamp);
      let contentHtml;
      if (isUser) {
        contentHtml = searchQ != null ? plainTextToSearchHighlightedHtml(msg.content, searchQ) : escapeHtml(msg.content);
      } else {
        const md = markdownToSafeHtml(msg.content);
        contentHtml = searchQ != null ? highlightSearchInHtmlFragment(md, searchQ) : md;
      }
      const msgKey = getMessageKey(conversation.siteId, conversation.id, msg.id);
      const selectable = isSelectMode ? "selectable" : "";
      const selected = isSelectMode && selectedMessages.has(msgKey) ? "selected" : "";
      const checkboxHtml = isSelectMode ? `<input type="checkbox" class="message-checkbox" data-msg-id="${escapeHtml(msg.id)}" ${selected ? "checked" : ""} />` : "";
      return `
        <div class="message-item ${msg.role} ${selectable} ${selected}" data-msg-id="${escapeHtml(msg.id)}">
          ${checkboxHtml}
          <div class="message-role">${roleLabel}</div>
          <div class="message-content">
            <div class="message-time">${timeStr}${!msg.isComplete && msg.role === "assistant" ? " \xB7 \u751F\u6210\u4E2D..." : ""}</div>
            <div class="message-body-wrapper">
              <div class="message-body ${isUser ? "" : "markdown-body"}">${contentHtml}</div>
            </div>
            <button class="message-expand-btn" data-msg-id="${escapeHtml(msg.id)}">\u5C55\u5F00\u66F4\u591A</button>
          </div>
        </div>
      `;
    }).join("");
    containerEl.querySelectorAll(".message-expand-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const msgItem = btn.closest(".message-item");
        const wrapper = msgItem.querySelector(".message-body-wrapper");
        const isExpanded = wrapper.classList.contains("expanded");
        if (isExpanded) {
          wrapper.classList.remove("expanded");
          btn.textContent = "\u5C55\u5F00\u66F4\u591A";
        } else {
          wrapper.classList.add("expanded");
          btn.textContent = "\u6536\u8D77";
        }
      });
    });
    containerEl.querySelectorAll(".message-item").forEach((msgItem) => {
      const wrapper = msgItem.querySelector(".message-body-wrapper");
      const btn = msgItem.querySelector(".message-expand-btn");
      if (!wrapper || !btn) return;
      wrapper.style.maxHeight = "none";
      const isOverflowing = wrapper.scrollHeight > 150;
      wrapper.style.maxHeight = "";
      if (isOverflowing) {
        btn.style.display = "inline-block";
      } else {
        btn.style.display = "none";
      }
    });
    if (isSelectMode) {
      containerEl.querySelectorAll(".message-item").forEach((el) => {
        el.addEventListener("click", (e) => {
          if (e.target.type === "checkbox") return;
          const checkbox = el.querySelector(".message-checkbox");
          if (checkbox) {
            checkbox.checked = !checkbox.checked;
            toggleMessageSelection(conversation, el.dataset.msgId, checkbox.checked);
          }
        });
      });
      containerEl.querySelectorAll(".message-checkbox").forEach((cb) => {
        cb.addEventListener("change", (e) => {
          toggleMessageSelection(conversation, e.target.dataset.msgId, e.target.checked);
        });
      });
    }
    containerEl.scrollTop = containerEl.scrollHeight;
  }
  function setCompareMode(enabled) {
    isCompareMode = !!enabled;
    if (!isCompareMode) {
      compareConversation = null;
      closeComparePicker();
    }
    renderChatPanels();
  }
  function getCompareCandidates(keyword = "") {
    const data = getConversationsForSidebar();
    const kw = String(keyword || "").trim().toLowerCase();
    const out = [];
    for (const siteId of ALL_SITE_IDS) {
      const list = data[siteId] || [];
      for (const conv of list) {
        if (primaryConversation && conv.id === primaryConversation.id) continue;
        const name = getConversationDisplayName(conv, "");
        if (kw) {
          const hit = name.toLowerCase().includes(kw) || (SITE_NAMES[siteId] || siteId).toLowerCase().includes(kw);
          if (!hit) continue;
        }
        out.push(conv);
      }
    }
    out.sort((a, b2) => (b2.updatedAt || 0) - (a.updatedAt || 0));
    return out;
  }
  function renderComparePickerList() {
    if (!comparePickerListEl) return;
    const list = getCompareCandidates(comparePickerSearchInput?.value || "");
    if (list.length === 0) {
      comparePickerListEl.innerHTML = '<p class="empty-hint">\u6682\u65E0\u53EF\u5BF9\u6BD4\u4F1A\u8BDD</p>';
      return;
    }
    comparePickerListEl.innerHTML = list.map((conv) => {
      const siteName = SITE_NAMES[conv.siteId] || conv.siteId;
      const title = getConversationDisplayName(conv, "");
      return `
        <button type="button" class="compare-picker-item" data-id="${escapeHtml(conv.id)}">
          <span class="compare-picker-item-site ${escapeHtml(conv.siteId)}">${escapeHtml(siteName)}</span>
          <span class="compare-picker-item-title">${escapeHtml(title)}</span>
        </button>
      `;
    }).join("");
  }
  function openComparePicker() {
    if (!comparePickerPopoverEl || !btnPickCompare) return;
    renderComparePickerList();
    comparePickerPopoverEl.removeAttribute("hidden");
    comparePickerPopoverEl.setAttribute("aria-hidden", "false");
    const rect = btnPickCompare.getBoundingClientRect();
    const width = Math.max(280, comparePickerPopoverEl.offsetWidth || 320);
    const left = Math.max(8, Math.min(window.innerWidth - width - 8, rect.right - width));
    const top = rect.bottom + 8;
    comparePickerPopoverEl.style.left = `${left}px`;
    comparePickerPopoverEl.style.top = `${top}px`;
    if (comparePickerSearchInput) {
      comparePickerSearchInput.value = "";
      comparePickerSearchInput.focus();
    }
  }
  function closeComparePicker() {
    if (!comparePickerPopoverEl) return;
    comparePickerPopoverEl.setAttribute("hidden", "");
    comparePickerPopoverEl.setAttribute("aria-hidden", "true");
  }
  async function loadCompareConversation(id) {
    if (!id || primaryConversation && id === primaryConversation.id) return;
    try {
      const fullConv = await sendMessage({ type: "GET_CONVERSATION", id });
      if (!fullConv) {
        showEphemeralHint("\u5BF9\u6BD4\u4F1A\u8BDD\u4E0D\u5B58\u5728");
        return;
      }
      compareConversation = fullConv;
      isCompareMode = true;
      renderChatPanels();
      closeComparePicker();
    } catch (e) {
      showEphemeralHint("\u52A0\u8F7D\u5BF9\u6BD4\u4F1A\u8BDD\u5931\u8D25");
    }
  }
  function getOrderedMessagesForDisplay(conversation) {
    if (!conversation || !Array.isArray(conversation.messages)) return [];
    if (conversation.siteId === "deepseek") {
      return conversation.messages.map((m2, index) => ({ m: m2, index })).sort((a, b2) => {
        const keyA = parseDeepseekMessageKey(a.m?.messageKey);
        const keyB = parseDeepseekMessageKey(b2.m?.messageKey);
        const aValid = keyA != null;
        const bValid = keyB != null;
        if (aValid && bValid && keyA !== keyB) return keyA - keyB;
        if (aValid !== bValid) return aValid ? -1 : 1;
        return a.index - b2.index;
      }).map((x2) => x2.m);
    }
    if (conversation.siteId === "yiyan") {
      return conversation.messages.slice().reverse();
    }
    return conversation.messages;
  }
  function parseDeepseekMessageKey(key) {
    if (key == null) return null;
    const n = Number(String(key).trim());
    return Number.isFinite(n) ? n : null;
  }
  function enterSelectMode() {
    if (isSessionManageMode) {
      exitSessionManageMode();
    }
    isSelectMode = true;
    selectToolbarEl.style.display = "";
    updateSelectedCount();
    renderChatPanels();
  }
  function exitSelectMode() {
    isSelectMode = false;
    selectedMessages.clear();
    selectToolbarEl.style.display = "none";
    selectAllCheckbox.checked = false;
    updateSelectedCount();
    renderChatPanels();
    renderConversationList();
  }
  function exitSessionManageMode() {
    if (!isSessionManageMode) return;
    isSessionManageMode = false;
    bulkSelectedConvIds.clear();
    sessionMenuOpenConvId = null;
    editingConvId = null;
    if (sessionManageToolbarEl) sessionManageToolbarEl.style.display = "none";
    updateSessionManageToolbarChrome();
    renderConversationList();
  }
  function enterSessionManageMode() {
    if (isSelectMode) {
      exitSelectMode();
    }
    sessionMenuOpenConvId = null;
    editingConvId = null;
    isSessionManageMode = true;
    if (sessionManageToolbarEl) sessionManageToolbarEl.style.display = "";
    updateSessionManageToolbarChrome();
    renderConversationList();
  }
  function beginInlineRename(convId) {
    sessionMenuOpenConvId = null;
    editingConvId = convId;
    renderConversationList();
    requestAnimationFrame(() => {
      const sid = String(convId);
      const inp = sessionListEl.querySelector(`.session-name-input[data-id="${CSS.escape(sid)}"]`);
      if (inp) {
        inp.focus();
        inp.select();
      }
    });
  }
  function toggleMessageSelection(conversation, msgId, selected) {
    if (!conversation) return;
    const key = getMessageKey(conversation.siteId, conversation.id, msgId);
    if (selected) {
      const msg = conversation.messages.find((m2) => m2.id === msgId);
      if (msg) {
        selectedMessages.set(key, {
          siteId: conversation.siteId,
          convId: conversation.id,
          convName: getConversationDisplayName(conversation, ""),
          msgId: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp
        });
      }
    } else {
      selectedMessages.delete(key);
    }
    updateSelectedCount();
    renderConversationList();
  }
  function updateSelectedCount() {
    selectedCountEl.textContent = `\u5DF2\u9009 ${selectedMessages.size} \u6761`;
    btnDoSummary.disabled = selectedMessages.size === 0;
    if (primaryConversation && primaryConversation.messages) {
      const currentConvKeys = primaryConversation.messages.map(
        (m2) => getMessageKey(primaryConversation.siteId, primaryConversation.id, m2.id)
      );
      const selectedInCurrentConv = currentConvKeys.filter((k2) => selectedMessages.has(k2)).length;
      selectAllCheckbox.checked = selectedInCurrentConv === primaryConversation.messages.length && primaryConversation.messages.length > 0;
      selectAllCheckbox.indeterminate = selectedInCurrentConv > 0 && selectedInCurrentConv < primaryConversation.messages.length;
    } else {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    }
  }
  function toggleSelectAll(checked) {
    if (!primaryConversation || !primaryConversation.messages) return;
    primaryChatMessagesEl.querySelectorAll(".message-checkbox").forEach((cb) => {
      cb.checked = checked;
      const el = cb.closest(".message-item");
      if (el) el.classList.toggle("selected", checked);
    });
    const prefix = getMessageKey(primaryConversation.siteId, primaryConversation.id, "");
    for (const key of selectedMessages.keys()) {
      if (key.startsWith(prefix)) {
        selectedMessages.delete(key);
      }
    }
    if (checked) {
      primaryConversation.messages.forEach((m2) => {
        const key = getMessageKey(primaryConversation.siteId, primaryConversation.id, m2.id);
        selectedMessages.set(key, {
          siteId: primaryConversation.siteId,
          convId: primaryConversation.id,
          convName: getConversationDisplayName(primaryConversation, ""),
          msgId: m2.id,
          role: m2.role,
          content: m2.content,
          timestamp: m2.timestamp
        });
      });
    }
    updateSelectedCount();
    renderConversationList();
  }
  async function doSummary() {
    if (selectedMessages.size === 0) return;
    const messagesByConv = /* @__PURE__ */ new Map();
    for (const msg of selectedMessages.values()) {
      const convKey = `${msg.siteId}:${msg.convId}`;
      if (!messagesByConv.has(convKey)) {
        messagesByConv.set(convKey, {
          siteId: msg.siteId,
          convId: msg.convId,
          convName: msg.convName,
          messages: []
        });
      }
      messagesByConv.get(convKey).messages.push(msg);
    }
    let contentParts = [];
    for (const [convKey, convData] of messagesByConv) {
      const sortedMsgs = convData.messages.sort((a, b2) => (a.timestamp || 0) - (b2.timestamp || 0));
      contentParts.push(`
### \u3010${convData.convName}\u3011(${SITE_NAMES[convData.siteId] || convData.siteId})
`);
      let currentQ = null;
      for (const msg of sortedMsgs) {
        if (msg.role === "user") {
          currentQ = msg.content;
        } else if (msg.role === "assistant" && currentQ) {
          contentParts.push(`**\u7528\u6237\u63D0\u95EE\uFF1A**
${currentQ}

**\u52A9\u624B\u56DE\u7B54\uFF1A**
${msg.content}
`);
          currentQ = null;
        } else if (msg.role === "assistant") {
          contentParts.push(`**\u52A9\u624B\u56DE\u7B54\uFF1A**
${msg.content}
`);
        }
      }
      if (currentQ) {
        contentParts.push(`**\u7528\u6237\u63D0\u95EE\uFF1A**
${currentQ}

**\u52A9\u624B\u56DE\u7B54\uFF1A**
\uFF08\u5C1A\u672A\u56DE\u7B54\uFF09
`);
      }
    }
    if (contentParts.length === 0) {
      alert("\u8BF7\u9009\u62E9\u81F3\u5C11\u4E00\u5BF9\u95EE\u7B54\u5185\u5BB9");
      return;
    }
    if (summaryStarSiteIds.size === 0) {
      alert("\u7ED9AI\u8BBE\u7F6E\u661F\u53F7\uFF0C\u8BBE\u5B9A\u4E3A\u63A5\u6536\u603B\u7ED3\u7684AI");
      return;
    }
    const summaryPrompt = `\u8BF7\u5BF9\u4EE5\u4E0B\u5BF9\u8BDD\u5185\u5BB9\u8FDB\u884C\u603B\u7ED3\uFF1A

---

${contentParts.join("\n\n---\n\n")}

---

\u8BF7\u63D0\u4F9B\u7B80\u6D01\u3001\u6709\u6761\u7406\u7684\u603B\u7ED3\u3002`;
    promptInput.value = summaryPrompt;
    pendingSummaryDispatch = true;
    promptInput.dispatchEvent(new Event("input"));
    exitSelectMode();
    await refreshSiteTabPresence();
    renderSendTargets();
    syncSendButtonEnabled();
    promptInput.focus();
  }
  async function commitInlineRename(convId, rawValue) {
    const trimmed = String(rawValue || "").trim();
    const conv = findConversationMetaById(convId);
    if (!conv) {
      editingConvId = null;
      sessionMenuOpenConvId = null;
      renderConversationList();
      return;
    }
    const prev = getConversationDisplayName(conv, "");
    if (trimmed === "" || trimmed === prev) {
      editingConvId = null;
      sessionMenuOpenConvId = null;
      renderConversationList();
      if (trimmed === "") await loadConversations();
      return;
    }
    editingConvId = null;
    sessionMenuOpenConvId = null;
    renderConversationList();
    try {
      const ok = await sendMessage({
        type: "RENAME_CONVERSATION",
        id: convId,
        customName: trimmed
      });
      if (ok) {
        if (primaryConversation && primaryConversation.id === convId) {
          primaryConversation.customName = trimmed;
          currentSessionTitleEl.textContent = trimmed;
        }
        if (compareConversation && compareConversation.id === convId) {
          compareConversation.customName = trimmed;
          renderChatPanels();
        }
        await loadConversations();
      } else {
        showEphemeralHint("\u91CD\u547D\u540D\u5931\u8D25");
        await loadConversations();
      }
    } catch (e) {
      showEphemeralHint("\u91CD\u547D\u540D\u5931\u8D25");
      await loadConversations();
    }
    renderConversationList();
  }
  async function deleteConversationById(id) {
    sessionMenuOpenConvId = null;
    syncSessionMenuPopoverPosition();
    try {
      const ok = await sendMessage({ type: "DELETE_CONVERSATION", id });
      if (!ok) {
        showEphemeralHint("\u5220\u9664\u5931\u8D25");
        return;
      }
      bulkSelectedConvIds.delete(id);
      if (editingConvId === id) editingConvId = null;
      if (primaryConversation && primaryConversation.id === id) {
        resetPrimaryConversationView();
      }
      if (compareConversation && compareConversation.id === id) {
        compareConversation = null;
      }
      renderChatPanels();
      await loadConversations();
    } catch (e) {
      showEphemeralHint("\u5220\u9664\u5931\u8D25");
    }
  }
  async function bulkDeleteSelectedSessions() {
    if (bulkSelectedConvIds.size === 0) return;
    const ids = [...bulkSelectedConvIds];
    let deleted = 0;
    for (const id of ids) {
      try {
        const ok = await sendMessage({ type: "DELETE_CONVERSATION", id });
        if (!ok) continue;
        deleted += 1;
        bulkSelectedConvIds.delete(id);
        if (editingConvId === id) editingConvId = null;
        if (primaryConversation && primaryConversation.id === id) {
          resetPrimaryConversationView();
        }
        if (compareConversation && compareConversation.id === id) {
          compareConversation = null;
        }
      } catch (_2) {
      }
    }
    bulkSelectedConvIds.clear();
    showEphemeralHint(deleted ? `\u5DF2\u5220\u9664 ${deleted} \u4E2A\u4F1A\u8BDD` : "\u672A\u5220\u9664\u4EFB\u4F55\u4F1A\u8BDD");
    renderChatPanels();
    sessionMenuOpenConvId = null;
    syncSessionMenuPopoverPosition();
    updateSessionManageToolbarChrome();
    await loadConversations({ force: true });
  }
  async function refreshSiteTabPresence() {
    try {
      const res = await sendMessage({ type: "CHECK_SITES_TAB_PRESENCE" });
      siteTabPresence = res && res.presence || {};
    } catch (_2) {
      siteTabPresence = {};
    }
  }
  function renderSendTargets() {
    if (!targetCheckboxList) {
      console.error("[PolyChat] targetCheckboxList is null");
      return;
    }
    const sortedPlatformIds = getSortedSiteIds("platform");
    console.log("[PolyChat] renderSendTargets called, sortedPlatformIds:", sortedPlatformIds);
    targetCheckboxList.innerHTML = sortedPlatformIds.map((siteId) => {
      const label = SITE_NAMES[siteId] || siteId;
      const hasTab = !!siteTabPresence[siteId];
      const isStarred = summaryStarSiteIds.has(siteId);
      const isChecked = selectedTargetSites.has(siteId);
      const missClass = hasTab ? "" : " missing";
      return `
    <label class="target-checkbox-item${missClass} ${isStarred ? "is-main" : ""}" draggable="true" data-site-id="${siteId}">
      <span class="target-drag-handle" title="\u62D6\u62FD\u6392\u5E8F">\u2630</span>
      <input type="checkbox" class="target-checkbox" data-site-id="${siteId}" ${isChecked ? "checked" : ""} />
      <button type="button" class="tab-star ${isStarred ? "active" : ""}" data-site-id="${siteId}" title="\u63A5\u6536\u603B\u7ED3\u7684 AI\uFF08\u53EF\u591A\u9009\uFF09\uFF1B\u5E76\u884C\u53D1\u9001\u540E\u8DF3\u8F6C\u5230\u6309\u987A\u5E8F\u7B2C\u4E00\u4E2A\u661F\u6807">${isStarred ? "\u2605" : "\u2606"}</button>
      <span class="tab-site ${siteId}">${escapeHtml(label)}</span>
      <button type="button" class="btn btn-small btn-ghost btn-open-site" data-site-id="${siteId}" title="\u65E0\u5219\u65B0\u5F00\uFF0C\u6709\u5219\u5207\u5230\u5F53\u524D\u7A97\u53E3\u5185\u6700\u8FD1\u4F7F\u7528\u7684\u8BE5\u7AD9\u6807\u7B7E">\u6253\u5F00</button>
    </label>
  `;
    }).join("");
    targetCheckboxList.querySelectorAll(".target-checkbox").forEach((cb) => {
      cb.addEventListener("change", (e) => {
        const siteId = cb.dataset.siteId;
        if (cb.checked) {
          selectedTargetSites.add(siteId);
          expandedSites.add(siteId);
        } else {
          selectedTargetSites.delete(siteId);
          expandedSites.delete(siteId);
        }
        renderSelectedTargets();
        updateSelectAllCheckbox();
        syncSendButtonEnabled();
        saveSelectedTargets();
        renderConversationList();
      });
    });
    targetCheckboxList.querySelectorAll(".tab-star").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSummaryStar(btn.dataset.siteId);
      });
    });
    targetCheckboxList.querySelectorAll(".btn-open-site").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        void openOrFocusSite(btn.dataset.siteId);
      });
    });
    renderSelectedTargets();
    updateSelectAllCheckbox();
    initDragAndDrop(targetCheckboxList, "platform");
  }
  function renderSelectedTargets() {
    if (selectedTargetSites.size === 0) {
      selectedTargetsEl.innerHTML = '<p class="empty-hint">\u672A\u9009\u62E9\u76EE\u6807</p>';
      return;
    }
    const sortedSites = Array.from(selectedTargetSites);
    const platformOrder = getSortedSiteIds("platform");
    sortedSites.sort((a, b2) => {
      const aIdx = platformOrder.indexOf(a);
      const bIdx = platformOrder.indexOf(b2);
      return aIdx - bIdx;
    });
    selectedTargetsEl.innerHTML = sortedSites.map((siteId) => {
      const label = SITE_NAMES[siteId] || siteId;
      const isStarred = summaryStarSiteIds.has(siteId);
      return `
    <div class="selected-target-tag ${isStarred ? "is-main" : ""}" data-site-id="${siteId}">
      <span class="tag-name">${escapeHtml(label)}</span>
      ${isStarred ? '<span class="tag-star">\u2605</span>' : ""}
      <button type="button" class="tag-close" data-site-id="${siteId}" title="\u79FB\u9664">\xD7</button>
    </div>
  `;
    }).join("");
    selectedTargetsEl.querySelectorAll(".tag-close").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const siteId = btn.dataset.siteId;
        selectedTargetSites.delete(siteId);
        expandedSites.delete(siteId);
        const checkbox = targetCheckboxList.querySelector(`.target-checkbox[data-site-id="${siteId}"]`);
        if (checkbox) checkbox.checked = false;
        renderSelectedTargets();
        updateSelectAllCheckbox();
        syncSendButtonEnabled();
        saveSelectedTargets();
        renderConversationList();
      });
    });
  }
  function updateSelectAllCheckbox() {
    const allCheckboxes = targetCheckboxList.querySelectorAll(".target-checkbox");
    const checkedCount = targetCheckboxList.querySelectorAll(".target-checkbox:checked").length;
    selectAllTargetsCheckbox.checked = allCheckboxes.length > 0 && checkedCount === allCheckboxes.length;
    selectAllTargetsCheckbox.indeterminate = checkedCount > 0 && checkedCount < allCheckboxes.length;
  }
  function saveSelectedTargets() {
    try {
      const starOrder = getSortedSiteIds("platform");
      const summaryStarSiteIdsArr = starOrder.filter((sid) => summaryStarSiteIds.has(sid));
      const data = {
        selectedSites: Array.from(selectedTargetSites),
        summaryStarSiteIds: summaryStarSiteIdsArr
      };
      chrome.storage.local.set({ polyChatSelectedTargets: data }, () => {
        if (chrome.runtime.lastError) {
          console.error("[PolyChat] \u4FDD\u5B58\u9009\u62E9\u72B6\u6001\u5931\u8D25:", chrome.runtime.lastError);
        }
      });
    } catch (e) {
      console.error("[PolyChat] \u4FDD\u5B58\u9009\u62E9\u72B6\u6001\u5931\u8D25:", e);
    }
  }
  async function loadSelectedTargets() {
    try {
      const result = await chrome.storage.local.get("polyChatSelectedTargets");
      if (result && result.polyChatSelectedTargets) {
        const data = result.polyChatSelectedTargets;
        if (Array.isArray(data.selectedSites)) {
          selectedTargetSites = new Set(data.selectedSites);
        }
        summaryStarSiteIds.clear();
        if (Array.isArray(data.summaryStarSiteIds)) {
          data.summaryStarSiteIds.forEach((sid) => {
            if (ALL_SITE_IDS.includes(sid)) summaryStarSiteIds.add(sid);
          });
        } else if (data.mainSiteId && ALL_SITE_IDS.includes(data.mainSiteId)) {
          summaryStarSiteIds.add(data.mainSiteId);
        }
      }
    } catch (e) {
      console.error("[PolyChat] \u52A0\u8F7D\u9009\u62E9\u72B6\u6001\u5931\u8D25:", e);
    }
  }
  async function openOrFocusSite(siteId) {
    try {
      const res = await sendMessage({ type: "OPEN_OR_FOCUS_SITE", siteId });
      if (!res || !res.ok) {
        alert(res?.error || "\u6253\u5F00\u5931\u8D25");
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      await refreshSiteTabPresence();
      renderSendTargets();
      syncSendButtonEnabled();
    } catch (e) {
      alert(e?.message || "\u6253\u5F00\u5931\u8D25");
    }
  }
  function getSelectedSiteIds() {
    return Array.from(selectedTargetSites);
  }
  function toggleSummaryStar(siteId) {
    if (summaryStarSiteIds.has(siteId)) {
      summaryStarSiteIds.delete(siteId);
    } else {
      summaryStarSiteIds.add(siteId);
    }
    renderSendTargets();
    syncSendButtonEnabled();
    saveSelectedTargets();
  }
  function getOrderedSummaryStarSitesWithPresence() {
    const order = getSortedSiteIds("platform");
    return order.filter((sid) => summaryStarSiteIds.has(sid) && siteTabPresence[sid]);
  }
  function getFocusSiteIdAfterSend(siteIds) {
    const order = getSortedSiteIds("platform");
    for (let i = 0; i < order.length; i++) {
      const sid = order[i];
      if (summaryStarSiteIds.has(sid) && siteIds.includes(sid)) return sid;
    }
    return siteIds[0] || null;
  }
  function updateSendTargetHint() {
    if (!sendTargetHintEl) return;
    let selected;
    if (pendingSummaryDispatch) {
      selected = getSortedSiteIds("platform").filter((sid) => summaryStarSiteIds.has(sid));
    } else {
      selected = getSelectedSiteIds();
    }
    const missing = selected.filter((sid) => !siteTabPresence[sid]);
    if (missing.length > 0) {
      const labels = missing.map((s) => SITE_NAMES[s] || s).join("\u3001");
      sendTargetHintEl.textContent = `\u5DF2\u52FE\u9009\u4F46\u672A\u5728\u5F53\u524D\u7A97\u53E3\u6253\u5F00\uFF1A${labels}\uFF0C\u8BF7\u5148\u70B9\u300C\u6253\u5F00\u300D\u3002`;
      sendTargetHintEl.removeAttribute("hidden");
    } else {
      sendTargetHintEl.textContent = "";
      sendTargetHintEl.setAttribute("hidden", "");
    }
  }
  function syncSendButtonEnabled() {
    const selected = pendingSummaryDispatch ? getOrderedSummaryStarSitesWithPresence() : getSelectedSiteIds();
    const hasPrompt = !!promptInput.value.trim();
    const allPresent = selected.length > 0 && selected.every((sid) => siteTabPresence[sid]);
    btnSend.disabled = !hasPrompt || !allPresent;
    if (btnNewSession) {
      btnNewSession.disabled = !allPresent;
    }
    updateSendTargetHint();
  }
  async function sendToSelectedTabs() {
    const prompt = promptInput.value.trim();
    const siteIds = pendingSummaryDispatch ? getOrderedSummaryStarSitesWithPresence() : getSelectedSiteIds();
    if (!prompt) return;
    if (!siteIds.length) return;
    if (!siteIds.every((sid) => siteTabPresence[sid])) return;
    promptInput.value = "";
    btnSend.disabled = true;
    if (sendTargetHintEl) sendTargetHintEl.setAttribute("hidden", "");
    const focusSiteId = getFocusSiteIdAfterSend(siteIds);
    if (focusSiteId) {
      try {
        await sendMessage({ type: "FOCUS_SITE_TAB", siteId: focusSiteId });
      } catch (_2) {
      }
    }
    try {
      const { ok, requestId, tabIds } = await sendMessage({
        type: "SEND_TO_TABS_STREAM",
        siteIds,
        prompt
      });
      if (!ok || !requestId || !Array.isArray(tabIds)) {
        syncSendButtonEnabled();
        return;
      }
      pendingSummaryDispatch = false;
      activeStream = {
        requestId,
        expectedTabIds: new Set(tabIds),
        doneTabIds: /* @__PURE__ */ new Set()
      };
    } catch (_e2) {
      syncSendButtonEnabled();
    }
  }
  async function navigateSelectedToNewSession() {
    const siteIds = getSelectedSiteIds();
    if (!siteIds.length) return;
    if (!siteIds.every((sid) => siteTabPresence[sid])) return;
    if (btnNewSession) btnNewSession.disabled = true;
    try {
      const res = await sendMessage({
        type: "NAVIGATE_SELECTED_TO_NEW_SESSION",
        siteIds
      });
      if (!res) {
        alert("\u65E0\u54CD\u5E94");
      } else if (!res.ok) {
        let detail = res.error || "\u8DF3\u8F6C\u5931\u8D25";
        if (Array.isArray(res.results)) {
          const failed = res.results.filter((r) => !r.ok);
          if (failed.length) {
            const lines = failed.map((r) => `${SITE_NAMES[r.siteId] || r.siteId}: ${r.error || "\u5931\u8D25"}`).join("\n");
            detail = `${detail}
${lines}`;
          }
        }
        alert(detail);
      }
      await refreshSiteTabPresence();
      renderSendTargets();
      syncSendButtonEnabled();
      await loadConversations({ refreshCurrentConversation: true });
    } catch (e) {
      alert(e?.message || "\u64CD\u4F5C\u5931\u8D25");
      syncSendButtonEnabled();
    }
  }
  var activeStream = null;
  async function updateStorageStats() {
    try {
      const stats = await sendMessage({ type: "GET_STORAGE_STATS" });
      if (stats) {
        const total = stats.totalConversations || 0;
        const totalMsgs = stats.totalMessages || 0;
        const bySite = stats.bySite || {};
        const parts = [];
        if (bySite.doubao) parts.push(`\u8C46\u5305 ${bySite.doubao}`);
        if (bySite.yuanbao) parts.push(`\u5143\u5B9D ${bySite.yuanbao}`);
        if (bySite.kimi) parts.push(`Kimi ${bySite.kimi}`);
        if (bySite.deepseek) parts.push(`DeepSeek ${bySite.deepseek}`);
        if (bySite.gemini) parts.push(`Gemini ${bySite.gemini}`);
        if (bySite.grok) parts.push(`Grok ${bySite.grok}`);
        const siteInfo = parts.length > 0 ? ` \xB7 ${parts.join(" \xB7 ")}` : "";
        storageStatsEl.textContent = `${total} \u4E2A\u4F1A\u8BDD \xB7 ${totalMsgs} \u6761\u6D88\u606F${siteInfo}`;
      }
    } catch (_2) {
    }
  }
  sessionListEl.addEventListener("click", (e) => {
    const locateBtn = e.target.closest(".btn-locate-origin");
    if (locateBtn) {
      e.preventDefault();
      e.stopPropagation();
      if (locateBtn.disabled) return;
      const convId = locateBtn.dataset.id;
      void (async () => {
        try {
          const res = await sendMessage({ type: "LOCATE_CONVERSATION_TAB", id: convId });
          if (!res || !res.ok) {
            alert(res?.error || "\u6253\u5F00\u5931\u8D25");
          }
        } catch (err) {
          alert(err?.message || "\u6253\u5F00\u5931\u8D25");
        }
      })();
      return;
    }
    const moreBtn = e.target.closest(".session-more-btn");
    if (moreBtn) {
      e.preventDefault();
      e.stopPropagation();
      const id = moreBtn.dataset.id;
      sessionMenuOpenConvId = sessionMenuOpenConvId === id ? null : id;
      renderConversationList();
      return;
    }
    if (e.target.closest(".session-bulk-cb-wrap")) {
      e.stopPropagation();
      return;
    }
    if (e.target.closest(".session-name-input")) {
      e.stopPropagation();
      return;
    }
    const item = e.target.closest(".session-item");
    if (!item) return;
    if (isSessionManageMode && e.target.closest(".session-name-text")) {
      e.preventDefault();
      e.stopPropagation();
      beginInlineRename(item.dataset.id);
      return;
    }
    if (isSessionManageMode) {
      e.preventDefault();
      const id = item.dataset.id;
      if (bulkSelectedConvIds.has(id)) bulkSelectedConvIds.delete(id);
      else bulkSelectedConvIds.add(id);
      updateSessionManageToolbarChrome();
      void selectConversation(id);
      return;
    }
    selectConversation(item.dataset.id);
  });
  sessionListEl.addEventListener("change", (e) => {
    const cb = e.target.closest(".session-bulk-cb");
    if (!cb || !isSessionManageMode) return;
    const id = cb.dataset.id;
    if (cb.checked) bulkSelectedConvIds.add(id);
    else bulkSelectedConvIds.delete(id);
    updateSessionManageToolbarChrome();
  });
  sessionListEl.addEventListener(
    "focusout",
    (e) => {
      const inp = e.target.closest && e.target.closest(".session-name-input");
      if (!inp || !sessionListEl.contains(inp)) return;
      if (editingConvId !== inp.dataset.id) return;
      void commitInlineRename(inp.dataset.id, inp.value);
    },
    true
  );
  sessionListEl.addEventListener("keydown", (e) => {
    if (!e.target.classList.contains("session-name-input")) return;
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      editingConvId = null;
      sessionMenuOpenConvId = null;
      renderConversationList();
    }
  });
  if (btnOpenOfficialSite) {
    btnOpenOfficialSite.addEventListener("click", () => {
      chrome.tabs.create({ url: "https://swarlow-r.github.io/polychat-web/#" });
    });
  }
  if (btnSessionSearch) {
    btnSessionSearch.addEventListener("click", () => {
      void runSessionSearch();
    });
  }
  if (btnSessionSearchClear) {
    btnSessionSearchClear.addEventListener("click", () => {
      clearSessionSearchFilter();
    });
  }
  if (sessionSearchInput) {
    sessionSearchInput.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" || e.shiftKey) return;
      e.preventDefault();
      void runSessionSearch();
    });
  }
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (comparePickerPopoverEl && !comparePickerPopoverEl.hasAttribute("hidden")) {
      e.preventDefault();
      closeComparePicker();
      return;
    }
    if (sessionMenuOpenConvId && !e.target.classList.contains("session-name-input")) {
      e.preventDefault();
      sessionMenuOpenConvId = null;
      renderConversationList();
      return;
    }
    if (activeSearchQuery == null) return;
    e.preventDefault();
    clearSessionSearchFilter();
  });
  btnSelectMode.addEventListener("click", enterSelectMode);
  btnCancelSelect.addEventListener("click", exitSelectMode);
  btnDoSummary.addEventListener("click", doSummary);
  if (btnToggleCompare) {
    btnToggleCompare.addEventListener("click", () => {
      if (!primaryConversation) {
        showEphemeralHint("\u8BF7\u5148\u9009\u62E9\u4E3B\u4F1A\u8BDD");
        return;
      }
      setCompareMode(!isCompareMode);
    });
  }
  if (btnPickCompare) {
    btnPickCompare.addEventListener("click", () => {
      if (!primaryConversation) {
        showEphemeralHint("\u8BF7\u5148\u9009\u62E9\u4E3B\u4F1A\u8BDD");
        return;
      }
      openComparePicker();
    });
  }
  if (btnSessionManage) btnSessionManage.addEventListener("click", enterSessionManageMode);
  if (btnSessionManageCancel) btnSessionManageCancel.addEventListener("click", exitSessionManageMode);
  if (btnSessionManageDelete) btnSessionManageDelete.addEventListener("click", () => void bulkDeleteSelectedSessions());
  if (btnSessionManageExport) {
    btnSessionManageExport.addEventListener("click", () => {
      showEphemeralHint("\u5BFC\u51FA\u529F\u80FD\u5373\u5C06\u4E0A\u7EBF");
    });
  }
  selectAllCheckbox.addEventListener("change", (e) => {
    toggleSelectAll(e.target.checked);
  });
  btnToggleSelector.addEventListener("click", () => {
    const isHidden = targetSelectorPanel.style.display === "none";
    if (isHidden) {
      targetSelectorPanel.style.display = "block";
      btnToggleSelector.textContent = "AI Platform \u25BC";
    } else {
      targetSelectorPanel.style.display = "none";
      btnToggleSelector.textContent = "AI Platform \u25B2";
    }
  });
  if (sessionMenuPopoverEl) {
    sessionMenuPopoverEl.addEventListener("click", (e) => {
      const renameBtn = e.target.closest(".session-menu-rename");
      if (renameBtn && renameBtn.dataset.id) {
        e.preventDefault();
        e.stopPropagation();
        beginInlineRename(renameBtn.dataset.id);
        return;
      }
      const delMenuBtn = e.target.closest(".session-menu-delete");
      if (delMenuBtn && delMenuBtn.dataset.id) {
        e.preventDefault();
        e.stopPropagation();
        void deleteConversationById(delMenuBtn.dataset.id);
      }
    });
  }
  sessionListEl.addEventListener(
    "scroll",
    () => {
      if (sessionMenuOpenConvId) syncSessionMenuPopoverPosition();
    },
    true
  );
  window.addEventListener("resize", () => {
    if (sessionMenuOpenConvId) syncSessionMenuPopoverPosition();
  });
  document.addEventListener("click", (e) => {
    if (sessionMenuOpenConvId && !e.target.closest("#session-menu-popover") && !e.target.closest(".session-more-btn")) {
      sessionMenuOpenConvId = null;
      renderConversationList();
    }
    if (targetSelectorPanel.style.display === "none") return;
    if (targetSelectorPanel.contains(e.target)) return;
    if (btnToggleSelector.contains(e.target)) return;
    targetSelectorPanel.style.display = "none";
    btnToggleSelector.textContent = "AI Platform \u25B2";
  });
  if (comparePickerSearchInput) {
    comparePickerSearchInput.addEventListener("input", () => {
      renderComparePickerList();
    });
  }
  if (comparePickerListEl) {
    comparePickerListEl.addEventListener("click", (e) => {
      const item = e.target.closest(".compare-picker-item");
      if (!item || !item.dataset.id) return;
      void loadCompareConversation(item.dataset.id);
    });
  }
  document.addEventListener("click", (e) => {
    if (!comparePickerPopoverEl || comparePickerPopoverEl.hasAttribute("hidden")) return;
    if (comparePickerPopoverEl.contains(e.target)) return;
    if (btnPickCompare?.contains(e.target)) return;
    closeComparePicker();
  });
  selectAllTargetsCheckbox.addEventListener("change", (e) => {
    const isChecked = e.target.checked;
    const platformOrder = getSortedSiteIds("platform");
    platformOrder.forEach((siteId) => {
      if (isChecked) {
        selectedTargetSites.add(siteId);
        expandedSites.add(siteId);
      } else {
        selectedTargetSites.delete(siteId);
        expandedSites.delete(siteId);
      }
    });
    targetCheckboxList.querySelectorAll(".target-checkbox").forEach((cb) => {
      cb.checked = isChecked;
    });
    renderSelectedTargets();
    syncSendButtonEnabled();
    saveSelectedTargets();
    renderConversationList();
  });
  btnSend.addEventListener("click", sendToSelectedTabs);
  if (btnNewSession) {
    btnNewSession.addEventListener("click", () => {
      void navigateSelectedToNewSession();
    });
  }
  promptInput.addEventListener("input", () => {
    if (pendingSummaryDispatch && !promptInput.value.trim().startsWith(SUMMARY_PROMPT_PREFIX)) {
      pendingSummaryDispatch = false;
    }
    syncSendButtonEnabled();
  });
  promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!btnSend.disabled) {
        sendToSelectedTabs();
      }
    }
  });
  chrome.runtime.onMessage.addListener((message) => {
    if (!message) return;
    if (!activeStream) return;
    if (message.type !== "STREAM_DONE" && message.type !== "STREAM_CHUNK") return;
    if (message.requestId !== activeStream.requestId) return;
    const tabId = message.tabId;
    if (!activeStream.expectedTabIds.has(tabId)) return;
    if (activeStream.doneTabIds.has(tabId)) return;
    if (message.type === "STREAM_CHUNK") return;
    activeStream.doneTabIds.add(tabId);
    if (activeStream.doneTabIds.size >= activeStream.expectedTabIds.size) {
      activeStream = null;
      syncSendButtonEnabled();
    }
  });
  window.addEventListener("focus", () => {
    console.log("[Popup] \u7A97\u53E3\u83B7\u5F97\u7126\u70B9\uFF0C\u5237\u65B0\u4F1A\u8BDD\u6570\u636E...");
    loadConversations({ refreshCurrentConversation: true });
    void refreshSiteTabPresence().then(() => {
      renderSendTargets();
      syncSendButtonEnabled();
    });
  });
  window.addEventListener("blur", () => {
  });
  renderChatPanels();
  renderSendTargets();
  syncSendButtonEnabled();
  Promise.all([
    loadConversations({ refreshCurrentConversation: false }),
    loadSelectedTargets(),
    refreshSiteTabPresence(),
    loadCustomOrders()
  ]).then(() => {
    renderSendTargets();
    syncSendButtonEnabled();
    startAutoRefresh();
  }).catch((err) => {
    console.error("[PolyChat] \u521D\u59CB\u5316\u5931\u8D25:", err);
  });
})();
/*! Bundled license information:

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.3.3 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.3/LICENSE *)
*/
