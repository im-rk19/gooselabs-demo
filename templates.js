/* ==========================================================================
   Gooselabs — page templates.
   Plain JavaScript. No build tools, no frameworks, no installs.
   Used by two things:
     1. build.js        (regenerates every page on a computer with Node)
     2. admin.html      (regenerates every page inside the browser)
   ========================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.TEMPLATES = api;
})(this, function () {
  'use strict';

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function isTodo(v) { return typeof v === 'string' && v.indexOf('TODO') === 0; }
  function up(depth) { return depth === 0 ? '' : new Array(depth + 1).join('../'); }

  /* ---------- minimal markdown renderer ----------
     Handles what the content actually uses: headings, paragraphs, bold,
     italics, links, bullet lists, numbered lists and blockquotes. */
  function md(src) {
    if (!src) return '';
    var lines = String(src).replace(/\r\n/g, '\n').split('\n');
    var out = [], list = null, para = [], quote = [];

    function flushPara() {
      if (para.length) { out.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; }
    }
    function flushList() {
      if (list) { out.push('</' + list + '>'); list = null; }
    }
    function flushQuote() {
      if (quote.length) {
        out.push('<blockquote><p>' + inline(quote.join(' ')) + '</p></blockquote>');
        quote = [];
      }
    }
    function flushAll() { flushPara(); flushList(); flushQuote(); }

    for (var i = 0; i < lines.length; i++) {
      var l = lines[i], t = l.trim();

      if (!t) { flushAll(); continue; }

      var h = t.match(/^(#{1,4})\s+(.*)$/);
      if (h) { flushAll(); var lv = h[1].length + 1; out.push('<h' + lv + '>' + inline(h[2]) + '</h' + lv + '>'); continue; }

      if (/^>\s?/.test(t)) { flushPara(); flushList(); quote.push(t.replace(/^>\s?/, '')); continue; }
      flushQuote();

      if (/^[-*]\s+/.test(t)) {
        flushPara();
        if (list !== 'ul') { flushList(); out.push('<ul>'); list = 'ul'; }
        out.push('<li>' + inline(t.replace(/^[-*]\s+/, '')) + '</li>');
        continue;
      }
      if (/^\d+\.\s+/.test(t)) {
        flushPara();
        if (list !== 'ol') { flushList(); out.push('<ol>'); list = 'ol'; }
        out.push('<li>' + inline(t.replace(/^\d+\.\s+/, '')) + '</li>');
        continue;
      }
      flushList();
      para.push(t);
    }
    flushAll();
    return out.join('\n');
  }

  function inline(s) {
    return esc(s)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  }

  /* ---------- icons (inline SVG, replaces the emoji the old site used) ---------- */
  var ICON_PATHS = {
    stethoscope: 'M6 3v5a4 4 0 0 0 8 0V3M4 3h4M12 3h4M10 12v3a5 5 0 0 0 10 0v-1M20 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
    bot: 'M12 2v3M5 8h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2ZM9 13h.01M15 13h.01M9 17h6',
    compass: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM15.5 8.5l-2 5-5 2 2-5 5-2Z',
    rocket: 'M5 13c-1.5 1.5-2 5-2 5s3.5-.5 5-2c.9-.9.9-2.3 0-3.2a2.2 2.2 0 0 0-3 .2ZM12.5 15 9 11.5C10 7 13 4 19 3c-1 6-4 9-6.5 12Z',
    chart: 'M3 3v16a2 2 0 0 0 2 2h16M7 15l4-5 3.5 3.5L20 7',
    link: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7',
    hospital: 'M4 21V7l8-4 8 4v14M9 21v-5h6v5M12 8v4M10 10h4',
    hotel: 'M3 21h18M4 21V6l8-3 8 3v15M9 9h.01M15 9h.01M9 13h.01M15 13h.01M10 21v-4h4v4',
    factory: 'M3 21V10l6 4V10l6 4V6l6 4v11H3ZM7 21v-4M13 21v-4M18 21v-4',
    users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
    film: 'M3 4h18v16H3zM7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4',
    briefcase: 'M3 8h18v12H3zM8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18',
    check: 'M20 6 9 17l-5-5',
    arrow: 'M5 12h14M13 6l6 6-6 6',
    mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
    phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z',
    pin: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0ZM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
    spark: 'M12 2v6M12 16v6M2 12h6M16 12h6M6.3 6.3l4.2 4.2M13.5 13.5l4.2 4.2M17.7 6.3l-4.2 4.2M10.5 13.5l-4.2 4.2'
  };
  var WA_PATH = 'M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5 14c-.3.8-1.6 1.5-2.3 1.5-.6 0-1.3.3-4.4-1.1-3.1-1.4-5-4.7-5.2-4.9-.1-.2-1.2-1.6-1.2-3 0-1.5.8-2.2 1-2.5.3-.3.6-.4.8-.4h.6c.2 0 .5 0 .7.6l1 2.4c.1.2.1.4 0 .6l-.4.6-.3.3c-.1.2-.3.3-.1.6.2.3.8 1.4 1.8 2.3 1.2 1.1 2.2 1.4 2.5 1.6.3.1.5.1.7-.1l.9-1c.2-.3.4-.2.7-.1l2.3 1.1c.3.2.5.2.6.4.1.1.1.7-.2 1.5Z';

  function icon(name, size) {
    var d = ICON_PATHS[name] || ICON_PATHS.spark;
    size = size || 22;
    return '<svg class="ic" viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true" ' +
      'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
  }
  function waIcon(size) {
    return '<svg viewBox="0 0 24 24" width="' + (size || 26) + '" height="' + (size || 26) + '" aria-hidden="true" fill="currentColor"><path d="' + WA_PATH + '"/></svg>';
  }

  /* ---------- brand mark ---------- */
  function mark(id) {
    return '<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true">' +
      '<rect width="32" height="32" rx="9" fill="url(#' + id + ')"/>' +
      '<path d="M22 12.4a6.6 6.6 0 1 0 1.1 6.2h-6.4" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="32" y2="32">' +
      '<stop stop-color="#12bfa5"/><stop offset="1" stop-color="#c79738"/></linearGradient></defs></svg>';
  }

  return {
    esc: esc, md: md, icon: icon, waIcon: waIcon, mark: mark, isTodo: isTodo, up: up, ICON_PATHS: ICON_PATHS
  };
});
