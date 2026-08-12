/* ==========================================================================
   GooseLabs — SEO and readability analysis.
   Runs inside admin.html only. Never shipped to visitors.
   Implements the checks Yoast SEO Premium performs, in plain JavaScript.
   ========================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.SEO = api;
})(this, function () {
  'use strict';

  var GOOD = 'good', OK = 'ok', BAD = 'bad';

  /* ---------------- text utilities ---------------- */
  function stripMd(md) {
    return String(md || '')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/^>\s?/gm, '')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_`]/g, '')
      .replace(/^[-*]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '');
  }
  function words(t) { return (String(t).toLowerCase().match(/[a-z0-9'’\-]+/g) || []); }
  function sentences(t) {
    return String(t).replace(/\s+/g, ' ').split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/).map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 1; });
  }
  function paragraphs(md) {
    return String(md || '').split(/\n\s*\n/).map(function (p) { return p.trim(); })
      .filter(function (p) { return p && !/^#{1,6}\s/.test(p); });
  }
  function subheadings(md) {
    return (String(md || '').match(/^#{2,4}\s+.*$/gm) || []).map(function (h) { return h.replace(/^#{2,4}\s+/, ''); });
  }
  function syllables(w) {
    w = w.toLowerCase().replace(/[^a-z]/g, '');
    if (w.length <= 3) return 1;
    w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
    var m = w.match(/[aeiouy]{1,2}/g);
    return m ? m.length : 1;
  }

  /* normalise a keyphrase into its content words */
  var STOP = ('a an the and or but of for to in on at by with from as is are was were be been being ' +
    'this that these those it its your you we our they their he she his her not no do does did can could ' +
    'should would will may might must have has had i me my us them what which who whom when where why how').split(' ');
  function contentWords(phrase) {
    return words(phrase).filter(function (w) { return STOP.indexOf(w) === -1; });
  }
  function normalise(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim(); }

  /** does `text` contain the keyphrase (all content words present, order-insensitive)? */
  function hasPhrase(text, phrase) {
    if (!phrase) return false;
    var t = normalise(text);
    if (t.indexOf(normalise(phrase)) > -1) return true;
    var cw = contentWords(phrase);
    if (!cw.length) return false;
    return cw.every(function (w) { return new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\w*\\b').test(t); });
  }
  function countPhrase(text, phrase) {
    if (!phrase) return 0;
    var t = normalise(text), p = normalise(phrase);
    if (!p) return 0;
    var exact = (t.match(new RegExp('\\b' + p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g')) || []).length;
    if (exact) return exact;
    // fall back to counting sentences that contain every content word
    var cw = contentWords(phrase);
    if (!cw.length) return 0;
    return sentences(text).filter(function (s) {
      var ns = normalise(s);
      return cw.every(function (w) { return ns.indexOf(w) > -1; });
    }).length;
  }

  /* ---------------- pixel width of a title (Google truncates ~600px) ---------------- */
  var _ctx = null;
  function titleWidth(text) {
    try {
      if (!_ctx) { var c = document.createElement('canvas'); _ctx = c.getContext('2d'); }
      _ctx.font = '400 20px Arial, sans-serif';
      return Math.round(_ctx.measureText(String(text || '')).width);
    } catch (e) { return Math.round(String(text || '').length * 8.6); }
  }
  function descWidth(text) {
    try {
      if (!_ctx) { var c = document.createElement('canvas'); _ctx = c.getContext('2d'); }
      _ctx.font = '400 14px Arial, sans-serif';
      return Math.round(_ctx.measureText(String(text || '')).width);
    } catch (e) { return Math.round(String(text || '').length * 6.4); }
  }

  /* ---------------- readability helpers ---------------- */
  var TRANSITIONS = ('also besides furthermore moreover however nevertheless nonetheless although though whereas ' +
    'therefore thus hence consequently accordingly because since so that meanwhile afterwards subsequently ' +
    'finally firstly secondly thirdly instead rather similarly likewise conversely otherwise indeed in fact ' +
    'for example for instance in other words in addition as a result on the other hand in contrast in short ' +
    'to summarise to summarize in conclusion above all after all at the same time by contrast even so ' +
    'in particular of course on balance that is to begin with what is more').split(/\s(?=[a-z])/);
  var IRREGULAR = ('given taken seen known shown written driven born built bought brought caught chosen done ' +
    'drawn eaten fallen felt found forgotten got gone grown heard held kept known laid led left lent let lost ' +
    'made meant met paid put read run said sold sent set shown shut sung sat slept spoken spent stood taught ' +
    'told thought understood won worn').split(' ');

  function isPassive(sentence) {
    var w = words(sentence);
    for (var i = 0; i < w.length - 1; i++) {
      if (/^(is|are|was|were|be|been|being|get|gets|got)$/.test(w[i])) {
        for (var j = i + 1; j <= Math.min(i + 3, w.length - 1); j++) {
          if (/ed$/.test(w[j]) || IRREGULAR.indexOf(w[j]) > -1) return true;
        }
      }
    }
    return false;
  }

  function fleschReadingEase(text) {
    var s = sentences(text), w = words(text);
    if (!s.length || !w.length) return 0;
    var syl = w.reduce(function (n, x) { return n + syllables(x); }, 0);
    return Math.round((206.835 - 1.015 * (w.length / s.length) - 84.6 * (syl / w.length)) * 10) / 10;
  }
  function fleschLabel(score) {
    if (score >= 80) return 'very easy';
    if (score >= 70) return 'easy';
    if (score >= 60) return 'fairly easy';
    if (score >= 50) return 'fairly difficult';
    if (score >= 30) return 'difficult';
    return 'very difficult';
  }

  /* ---------------- the SEO analysis ---------------- */
  function analyseSeo(item, ctx) {
    ctx = ctx || {};
    var seo = item.seo || {};
    var kp = (seo.focusKeyphrase || '').trim();
    var syn = (seo.synonyms || []).filter(Boolean);
    var body = stripMd(item.body || '');
    var w = words(body);
    var title = item.seoTitle || item.title || '';
    var desc = item.seoDescription || item.excerpt || '';
    var slug = item.slug || '';
    var r = [];
    var cornerstone = !!seo.cornerstone;
    var minWords = cornerstone ? 900 : 300;

    function add(status, text, id) { r.push({ status: status, text: text, id: id }); }

    /* --- keyphrase itself --- */
    if (!kp) {
      add(BAD, 'No focus keyphrase set. Add the phrase you want this page to rank for.', 'kp');
    } else {
      var cw = contentWords(kp);
      if (cw.length > 4) add(OK, 'Keyphrase length: ' + cw.length + ' content words. Four or fewer usually ranks better.', 'kplen');
      else add(GOOD, 'Keyphrase length: good (' + cw.length + ' content word' + (cw.length === 1 ? '' : 's') + ').', 'kplen');

      /* duplicate keyphrase across the site */
      var dupes = (ctx.allItems || []).filter(function (o) {
        return o !== item && o.seo && normalise(o.seo.focusKeyphrase) === normalise(kp) && normalise(kp);
      });
      if (dupes.length) add(BAD, 'This keyphrase is already the focus of ' + dupes.length + ' other page' + (dupes.length > 1 ? 's' : '') + ' (' + dupes.map(function (d) { return d.title; }).join(', ') + '). They will compete with each other.', 'dupe');
      else add(GOOD, 'This keyphrase is not used as the focus anywhere else.', 'dupe');

      /* title */
      if (hasPhrase(title, kp)) {
        var pos = normalise(title).indexOf(normalise(kp));
        if (pos > -1 && pos <= Math.max(12, title.length * 0.35)) add(GOOD, 'Keyphrase appears near the start of the SEO title.', 'kptitle');
        else add(OK, 'Keyphrase is in the SEO title, but moving it closer to the front usually helps.', 'kptitle');
      } else add(BAD, 'Keyphrase does not appear in the SEO title.', 'kptitle');

      /* meta description */
      add(hasPhrase(desc, kp) ? GOOD : BAD,
        hasPhrase(desc, kp) ? 'Keyphrase appears in the meta description.' : 'Keyphrase does not appear in the meta description.', 'kpdesc');

      /* slug */
      add(hasPhrase(slug.replace(/-/g, ' '), kp) ? GOOD : OK,
        hasPhrase(slug.replace(/-/g, ' '), kp) ? 'Keyphrase appears in the page address.' : 'Keyphrase does not appear in the page address (slug).', 'kpslug');

      /* first paragraph */
      var firstPara = paragraphs(item.body)[0] || '';
      add(hasPhrase(firstPara, kp) ? GOOD : BAD,
        hasPhrase(firstPara, kp) ? 'Keyphrase appears in the opening paragraph.' : 'Keyphrase does not appear in the opening paragraph.', 'kpintro');

      /* subheadings */
      var subs = subheadings(item.body);
      if (!subs.length) add(OK, 'No subheadings in this text. Adding a few helps both readers and search engines.', 'kpsub');
      else {
        var hit = subs.filter(function (h) { return hasPhrase(h, kp) || syn.some(function (s2) { return hasPhrase(h, s2); }); }).length;
        var pct = hit / subs.length;
        if (pct === 0) add(BAD, 'Keyphrase appears in none of the ' + subs.length + ' subheadings.', 'kpsub');
        else if (pct > 0.75) add(OK, 'Keyphrase appears in ' + hit + ' of ' + subs.length + ' subheadings — that is more than needed and reads as stuffing.', 'kpsub');
        else add(GOOD, 'Keyphrase appears in ' + hit + ' of ' + subs.length + ' subheadings.', 'kpsub');
      }

      /* density */
      var count = countPhrase(body, kp);
      var synCount = syn.reduce(function (n, s2) { return n + countPhrase(body, s2); }, 0);
      var density = w.length ? ((count + synCount) / w.length) * 100 : 0;
      var dtxt = 'Keyphrase density ' + density.toFixed(1) + '% — the phrase appears ' + count + ' time' + (count === 1 ? '' : 's') +
        (synCount ? ' plus ' + synCount + ' synonym use' + (synCount === 1 ? '' : 's') : '') + ' in ' + w.length + ' words.';
      if (density === 0) add(BAD, dtxt + ' It should appear at least twice.', 'density');
      else if (density < 0.5) add(OK, dtxt + ' Aim for 0.5–3%.', 'density');
      else if (density > 3.5) add(BAD, dtxt + " That is too high and reads as keyword stuffing.", "density");
      else add(GOOD, dtxt, 'density');

      /* distribution across the text */
      if (count >= 2) {
        var sents = sentences(body), thirds = [0, 0, 0];
        sents.forEach(function (s2, i) {
          if (hasPhrase(s2, kp)) thirds[Math.min(2, Math.floor((i / sents.length) * 3))]++;
        });
        var empty = thirds.filter(function (x) { return x === 0; }).length;
        if (empty === 0) add(GOOD, 'Keyphrase is spread evenly through the text.', 'dist');
        else if (empty === 1) add(OK, 'Keyphrase is missing from one third of the text.', 'dist');
        else add(BAD, 'Keyphrase is clustered in one part of the text rather than spread through it.', 'dist');
      }
    }

    /* --- title and description lengths (pixel-accurate) --- */
    var tw = titleWidth(title);
    if (!title) add(BAD, 'No SEO title set.', 'titlelen');
    else if (tw < 285) add(OK, 'SEO title is short (' + tw + 'px of 600). There is room for more.', 'titlelen');
    else if (tw > 600) add(BAD, 'SEO title is ' + tw + 'px — Google will cut it off after about 600px.', 'titlelen');
    else add(GOOD, 'SEO title width is good (' + tw + 'px of 600).', 'titlelen');

    var dl = desc.length;
    if (!desc) add(BAD, 'No meta description set.', 'desclen');
    else if (dl < 120) add(OK, 'Meta description is ' + dl + ' characters. Use 120–156 to fill the space.', 'desclen');
    else if (dl > 156) add(BAD, 'Meta description is ' + dl + ' characters — Google will truncate it after about 156.', 'desclen');
    else add(GOOD, 'Meta description length is good (' + dl + ' characters).', 'desclen');

    /* --- text length --- */
    if (w.length < minWords) add(BAD, 'Text is ' + w.length + ' words. ' + (cornerstone ? 'Cornerstone content should be at least 900.' : 'Aim for at least 300.'), 'len');
    else add(GOOD, 'Text length: ' + w.length + ' words.', 'len');

    /* --- links --- */
    var linkRe = /\[([^\]]*)\]\(([^)]+)\)/g, m, internal = 0, external = 0, anchorKp = false;
    while ((m = linkRe.exec(item.body || ''))) {
      if (/^https?:\/\//.test(m[2]) && (!ctx.siteUrl || m[2].indexOf(ctx.siteUrl) === -1)) external++; else internal++;
      if (kp && hasPhrase(m[1], kp)) anchorKp = true;
    }
    add(internal ? GOOD : BAD, internal ? 'Contains ' + internal + ' internal link' + (internal === 1 ? '' : 's') + '.' : 'No internal links. Link to related pages so visitors and Google can find them.', 'ilink');
    add(external ? GOOD : OK, external ? 'Contains ' + external + ' outbound link' + (external === 1 ? '' : 's') + '.' : 'No outbound links. Citing a source adds credibility.', 'olink');
    if (anchorKp) add(BAD, 'A link uses the focus keyphrase as its anchor text — that points visitors away from the page you want to rank.', 'kplink');

    /* --- images --- */
    var imgs = (item.body || '').match(/!\[[^\]]*\]\([^)]+\)/g) || [];
    if (item.image && String(item.image).indexOf('TODO') !== 0) imgs.push('featured');
    if (!imgs.length) add(OK, 'No images in this content. One relevant image usually improves engagement.', 'img');
    else if (kp) {
      var alts = ((item.body || '').match(/!\[([^\]]*)\]/g) || []).join(' ') + ' ' + (item.imageAlt || '');
      add(hasPhrase(alts, kp) ? GOOD : OK, hasPhrase(alts, kp)
        ? 'Keyphrase appears in image alt text.'
        : 'Keyphrase does not appear in any image alt text.', 'img');
    } else add(GOOD, imgs.length + ' image' + (imgs.length === 1 ? '' : 's') + ' present.', 'img');

    return r;
  }

  /* ---------------- the readability analysis ---------------- */
  function analyseReadability(item) {
    var body = stripMd(item.body || '');
    var w = words(body), sents = sentences(body), paras = paragraphs(item.body), subs = subheadings(item.body);
    var r = [];
    function add(status, text, id) { r.push({ status: status, text: text, id: id }); }

    if (!w.length) { add(BAD, 'No text to analyse yet.', 'empty'); return r; }

    /* Flesch */
    var fre = fleschReadingEase(body);
    add(fre >= 60 ? GOOD : fre >= 50 ? OK : BAD,
      'Reading ease ' + fre + ' (' + fleschLabel(fre) + '). Aim for 60 or above for a business audience.', 'flesch');

    /* sentence length */
    var longS = sents.filter(function (s) { return words(s).length > 20; }).length;
    var longPct = Math.round((longS / sents.length) * 100);
    add(longPct <= 25 ? GOOD : BAD,
      longPct + '% of sentences are over 20 words (' + longS + ' of ' + sents.length + '). Keep it at 25% or below.', 'sentlen');

    /* paragraph length */
    var longP = paras.filter(function (p) { return words(p).length > 150; }).length;
    add(longP === 0 ? GOOD : BAD,
      longP === 0 ? 'No paragraph is longer than 150 words.' : longP + ' paragraph' + (longP === 1 ? ' is' : 's are') + ' over 150 words. Break them up.', 'paralen');

    /* subheading distribution */
    if (w.length < 300) add(GOOD, 'Text is short enough not to need subheadings.', 'subdist');
    else if (!subs.length) add(BAD, 'No subheadings. A text this long needs them.', 'subdist');
    else {
      var chunks = String(item.body).split(/^#{2,4}\s+.*$/gm).map(function (c) { return words(stripMd(c)).length; });
      var worst = Math.max.apply(null, chunks);
      add(worst <= 300 ? GOOD : BAD,
        worst <= 300 ? 'Subheadings are well distributed (longest run ' + worst + ' words).'
                     : 'One section runs ' + worst + ' words without a subheading. Aim for 300 or fewer.', 'subdist');
    }

    /* passive voice */
    var pass = sents.filter(isPassive).length;
    var passPct = Math.round((pass / sents.length) * 100);
    add(passPct <= 10 ? GOOD : BAD,
      passPct + '% of sentences use passive voice (' + pass + ' of ' + sents.length + '). Keep it at 10% or below.', 'passive');

    /* transition words */
    var trans = sents.filter(function (s) {
      var ns = ' ' + normalise(s) + ' ';
      return TRANSITIONS.some(function (t) { return ns.indexOf(' ' + t + ' ') > -1; });
    }).length;
    var transPct = Math.round((trans / sents.length) * 100);
    add(transPct >= 30 ? GOOD : transPct >= 20 ? OK : BAD,
      transPct + '% of sentences contain a transition word. Aim for 30% or more to help the text flow.', 'transition');

    /* consecutive sentences starting the same way */
    var runs = 0, best = 1, cur = 1;
    for (var i = 1; i < sents.length; i++) {
      var a = (words(sents[i - 1])[0] || ''), b = (words(sents[i])[0] || '');
      if (a && a === b) { cur++; if (cur >= 3) runs++; } else { best = Math.max(best, cur); cur = 1; }
    }
    add(runs === 0 ? GOOD : OK,
      runs === 0 ? 'No three sentences in a row start with the same word.' : runs + ' place' + (runs === 1 ? '' : 's') + ' where three or more sentences start with the same word.', 'consecutive');

    return r;
  }

  /* ---------------- prominent words (Yoast Premium "Insights") ---------------- */
  function prominentWords(item, limit) {
    var body = stripMd((item.title || '') + ' ' + (item.body || ''));
    var counts = {};
    words(body).forEach(function (w) {
      if (w.length < 4 || STOP.indexOf(w) > -1) return;
      counts[w] = (counts[w] || 0) + 1;
    });
    return Object.keys(counts).map(function (k) { return { word: k, n: counts[k] }; })
      .sort(function (a, b) { return b.n - a.n; }).slice(0, limit || 12);
  }

  /* ---------------- internal linking suggestions (Yoast Premium) ---------------- */
  function linkSuggestions(item, all, limit) {
    var mine = {}; prominentWords(item, 25).forEach(function (p) { mine[p.word] = p.n; });
    return all.filter(function (o) { return o.item !== item; }).map(function (o) {
      var score = 0;
      prominentWords(o.item, 25).forEach(function (p) { if (mine[p.word]) score += Math.min(p.n, mine[p.word]); });
      if (o.item.seo && o.item.seo.focusKeyphrase && hasPhrase(item.body, o.item.seo.focusKeyphrase)) score += 12;
      var already = (item.body || '').indexOf(o.href) > -1;
      return { title: o.item.title, href: o.href, score: score, linked: already };
    }).filter(function (x) { return x.score > 0; })
      .sort(function (a, b) { return (a.linked - b.linked) || (b.score - a.score); })
      .slice(0, limit || 6);
  }


  /* ---------------- overall score ----------------
     Two models are provided:
     1) percent()  — our own: share of points earned out of the maximum. Finer grained,
                     useful for tracking improvement over time.
     2) penalty()  — Yoast's published model: a red bullet costs 3 penalty points and an
                     orange bullet costs 2. Seven or more penalty points is red overall,
                     five or six is orange, anything less is green.
                     Source: yoast.com/content-analysis-methodological-choices-explained
  */
  function penalty(results) {
    var pts = results.reduce(function (n, x) {
      return n + (x.status === BAD ? 3 : x.status === OK ? 2 : 0); }, 0);
    // Yoast sets its thresholds at 7 and 5 across roughly 14 checks. This analyser runs more
    // checks than that, so penalties accumulate faster. The thresholds are scaled by check
    // count to keep the bullet as strict as Yoast's, and no stricter.
    var red = Math.round(7 * results.length / 14), amber = Math.round(5 * results.length / 14);
    return { points: pts, red: red, amber: amber,
             bullet: pts >= red ? BAD : pts >= amber ? OK : GOOD };
  }

  function score(results) {
    if (!results.length) return 0;
    var pts = results.reduce(function (n, x) { return n + (x.status === GOOD ? 2 : x.status === OK ? 1 : 0); }, 0);
    return Math.round((pts / (results.length * 2)) * 100);
  }
  function bullet(pct) { return pct >= 70 ? GOOD : pct >= 40 ? OK : BAD; }

  return {
    analyseSeo: analyseSeo, analyseReadability: analyseReadability,
    prominentWords: prominentWords, linkSuggestions: linkSuggestions,
    score: score, bullet: bullet, penalty: penalty,
    titleWidth: titleWidth, descWidth: descWidth,
    fleschReadingEase: fleschReadingEase, fleschLabel: fleschLabel,
    stripMd: stripMd, words: words, sentences: sentences, hasPhrase: hasPhrase, GOOD: GOOD, OK: OK, BAD: BAD
  };
});
