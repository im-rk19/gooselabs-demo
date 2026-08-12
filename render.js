/* ==========================================================================
   GooseLabs — builds every page of the site from the content data.
   Add a service to content.js and a new page appears here automatically.
   ========================================================================== */
(function (root, factory) {
  var P = (typeof require !== 'undefined' && typeof module !== 'undefined')
    ? require('./pages.js') : window.PAGES;
  var api = factory(P);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.RENDER = api;
})(this, function (P) {
  'use strict';
  var T = P.T, esc = T.esc, md = T.md, icon = T.icon, isTodo = T.isTodo;

  function fmtDate(d) {
    var dt = new Date(d);
    if (isNaN(dt)) return String(d);
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function card(href, inner) { return '<a href="' + href + '" class="card">' + inner + '</a>'; }

  /* =============================== HOME =============================== */
  function home(D) {
    var s = D.site;
    var faqs = [
      { q: 'Where is GooseLabs based?', a: 'Raipur, Chhattisgarh. We work with clients across India, and most engagements begin with time spent on site because that is where the useful detail is.' },
      { q: 'What does an engagement usually cost?', a: 'A two-week AI use case sprint is a fixed-price engagement. Builds are scoped after that, because quoting a platform before understanding the operation produces a number that is wrong in both directions.' },
      { q: 'Do you only work in healthcare?', a: 'Healthcare is where we have the deepest evidence, because our founder is technology lead at a working clinic. We also build for hospitality, manufacturing, membership communities, creator teams and SMEs.' },
      { q: 'Will you tell us if AI is not the answer?', a: 'Yes, and it happens. Our discovery sprint is designed to be able to conclude that nothing should be built yet. That is a better outcome than a pilot that quietly dies after six months.' }
    ];

    var stats = (s.stats || []).map(function (st) {
      return '<div class="stat"><strong>' + esc(st.value) + '</strong><span>' + esc(st.label) + '</span>' +
        (st.verified ? '' : '<span class="todo">unverified</span>') + '</div>';
    }).join('');

    var body =
'<header class="container hero"><div>' +
  '<div class="eyebrow">AI &middot; Data &middot; Automation &middot; Product</div>' +
  '<h1>We build <span class="grad">AI systems</span> that survive contact with a real business.</h1>' +
  '<p class="lead">GooseLabs is an AI product studio in Raipur. We turn scattered WhatsApp messages, spreadsheets and disconnected software into systems people actually use &mdash; starting with healthcare, where we build from inside a working clinic.</p>' +
  '<div class="btn-row"><a href="#finder" class="btn btn-primary">Find where to start ' + icon('arrow', 16) + '</a>' +
  '<a href="work/index.html" class="btn btn-secondary">See our work</a></div>' +
  '<div class="stats">' + stats + '</div>' +
'</div><div class="hero-visual" aria-hidden="true">' +
  '<div class="orb"></div>' +
  '<div class="orbit-card c1"><div class="ib">' + icon('stethoscope', 18) + '</div><h4>Clinical AI</h4><p>Notes written during the consultation.</p></div>' +
  '<div class="orbit-card c2"><div class="ib">' + icon('bot', 18) + '</div><h4>WhatsApp agents</h4><p>Reminders, reports, escalations.</p></div>' +
  '<div class="orbit-card c3"><div class="ib">' + icon('chart', 18) + '</div><h4>Dashboards</h4><p>One number everyone trusts.</p></div>' +
  '<div class="orbit-card c4"><div class="ib">' + icon('rocket', 18) + '</div><h4>Products</h4><p>MVPs that reach real users.</p></div>' +
'</div></header>' +

'<section class="section"><div class="container">' +
  '<div class="kicker">What we do</div><h2>Six ways we usually start.</h2>' +
  '<p class="lead">Every engagement begins with the process that hurts most, not with a platform diagram.</p>' +
  '<div class="grid g3">' + D.services.map(function (x) {
    return card('services/' + x.slug + '.html',
      '<div class="icon-bubble">' + icon(x.icon) + '</div><h3>' + esc(x.title) + '</h3>' +
      '<p>' + esc(x.tagline) + '</p><span class="card-cta">Read more &rarr;</span>');
  }).join('') + '</div></div></section>' +

'<section class="section" id="finder"><div class="container">' + finderHtml(D) + '</div></section>' +

'<section class="section"><div class="container">' +
  '<div class="kicker">Selected work</div><h2>Systems running in production.</h2>' +
  '<p class="lead">Three builds, each solving an operational problem for a named organisation.</p>' +
  '<div class="grid g3">' + D.work.filter(function (w) { return w.featured; }).slice(0, 3).map(function (w) {
    return card('work/' + w.slug + '.html',
      '<span class="eyebrow">' + esc(w.status) + '</span><h3>' + esc(w.title) + '</h3>' +
      '<p>' + esc(w.tagline) + '</p><div class="tags">' +
      (w.tags || []).slice(0, 3).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') +
      '</div><span class="card-cta">Read the case study &rarr;</span>');
  }).join('') + '</div></div></section>' +

'<section class="section"><div class="container">' +
  '<div class="kicker">Industries</div><h2>Built for people running complex operations.</h2>' +
  '<p class="lead">Different sectors, one shared problem: too much information and too little structure.</p>' +
  '<div class="grid g3">' + D.industries.map(function (x) {
    return card('industries/' + x.slug + '.html',
      '<div class="icon-bubble">' + icon(x.icon) + '</div><h3>' + esc(x.title) + '</h3>' +
      '<p>' + esc(x.tagline) + '</p><span class="card-cta">Explore &rarr;</span>');
  }).join('') + '</div></div></section>' +

'<section class="section"><div class="container">' +
  '<div class="kicker">Insights</div><h2>Written from the builds, not the brochure.</h2>' +
  '<div class="grid g3">' + D.insights.slice(0, 3).map(function (p) {
    return card('insights/' + p.slug + '.html',
      '<span class="meta">' + esc(fmtDate(p.date)) + ' &middot; ' + esc(p.readingTime) + ' min read</span>' +
      '<h3>' + esc(p.title) + '</h3><p>' + esc(p.excerpt) + '</p><span class="card-cta">Read &rarr;</span>');
  }).join('') + '</div></div></section>' +

'<section class="section"><div class="container"><div class="narrow">' +
  '<div class="kicker">Questions</div><h2 style="margin-bottom:22px">Before you get in touch.</h2>' +
  '<div class="faq">' + faqs.map(function (f) {
    return '<details><summary>' + esc(f.q) + '</summary><p>' + esc(f.a) + '</p></details>'; }).join('') +
  '</div></div></div></section>' +

P.ctaBand(0, 'Let’s find out whether AI is worth it for your business.',
  'A short call, no pitch deck. If we do not think there is a case for building anything yet, we will say so.');

    return P.shell(D, {
      depth: 0, path: '', current: 'home',
      title: 'GooseLabs — AI Automation & Product Studio in Raipur',
      description: 'Raipur-based AI product studio building clinical AI, WhatsApp-first automation and decision dashboards for healthcare, hospitality and Indian SMEs.',
      schema: [P.orgSchema(D), P.faqSchema(faqs)],
      body: body
    });
  }

  /* the finder quiz - qualifies the visitor and captures the lead */
  function finderHtml(D) {
    return '' +
'<div class="finder" id="finderWidget">' +
  '<div class="finder-left">' +
    '<div class="kicker">Interactive finder</div>' +
    '<h2 class="h2-sm">Not sure what you need?</h2>' +
    '<p class="muted">Three quick questions. We will tell you where we would start &mdash; and whether we think you should build anything at all.</p>' +
    '<div class="progress"><div class="progress-bar" id="fProgress"></div></div>' +
    '<div class="muted small" id="fStep">Step 1 of 3</div>' +
    '<div class="pill-row"><span class="pill">No jargon</span><span class="pill">Business first</span><span class="pill">Honest about limits</span></div>' +
  '</div>' +
  '<div class="finder-right" id="fBody"></div>' +
'</div>';
  }

  /* ============================ SERVICES ============================ */
  function servicesIndex(D) {
    var cr = [{ name: 'Home', file: 'index.html', path: '' }, { name: 'Services', file: 'services/index.html', path: 'services' }];
    var body = P.pageHead(1, cr, 'What we build.',
      'Six service lines. Most engagements start with one of them and expand only after the first thing is genuinely being used.') +
      '<section class="section-tight"><div class="container"><div class="grid g2">' +
      D.services.map(function (x) {
        return card(x.slug + '.html',
          '<div class="icon-bubble">' + icon(x.icon) + '</div><h3>' + esc(x.title) + '</h3>' +
          '<p>' + esc(x.tagline) + '</p>' + P.checkList((x.outcomes || []).slice(0, 3)) +
          '<span class="card-cta">Read more &rarr;</span>');
      }).join('') + '</div></div></section>' + P.ctaBand(1, 'Not sure which one fits?', 'Tell us the problem and we will tell you where we would start.');
    return P.shell(D, { depth: 1, path: 'services', current: 'services',
      title: 'AI Automation, Clinical AI & Product Builds',
      description: 'Healthcare AI systems, WhatsApp-first automation, AI use case sprints, MVP builds, dashboards and custom integrations for Indian businesses.',
      schema: [P.crumbs(D, [{ name: 'Home', path: '' }, { name: 'Services', path: 'services' }])], body: body });
  }

  function servicePage(D, x) {
    var cr = [{ name: 'Home', file: 'index.html' }, { name: 'Services', file: 'services/index.html' }, { name: x.title, file: '' }];
    var related = D.work.filter(function (w) { return w.service === x.slug; });
    var base = D.site.url.replace(/\/$/, '');
    var body = P.pageHead(1, cr, x.title, x.tagline) +
'<section class="section-tight"><div class="container"><div class="grid g2 start">' +
  '<div class="card"><div class="icon-bubble">' + icon('check') + '</div><h3>What changes</h3>' + P.checkList(x.outcomes) + '</div>' +
  '<div class="card"><div class="icon-bubble">' + icon(x.icon) + '</div><h3>What we deliver</h3>' + P.checkList(x.deliverables, 'arrow') + '</div>' +
'</div></div></section>' +
'<section class="section-tight"><div class="container"><div class="prose">' + md(x.body) + '</div></div></section>' +
(related.length ? '<section class="section-tight"><div class="container"><div class="kicker">Related work</div>' +
  '<h2 style="margin-bottom:24px">Where we have done this.</h2><div class="grid g3">' +
  related.map(function (w) {
    return card('../work/' + w.slug + '.html', '<h3>' + esc(w.title) + '</h3><p>' + esc(w.tagline) + '</p><span class="card-cta">Read the case study &rarr;</span>');
  }).join('') + '</div></div></section>' : '') +
P.faqBlock(x.faqs) +
P.ctaBand(1, 'Thinking about ' + x.title + '?', 'Tell us what the problem looks like day to day. If we do not think this is the right starting point for you, we will say so.');

    return P.shell(D, { depth: 1, path: 'services/' + x.slug, current: 'services', seo: x.seo,
      title: x.seoTitle || x.title, description: x.seoDescription || x.tagline,
      schema: [
        P.crumbs(D, [{ name: 'Home', path: '' }, { name: 'Services', path: 'services' }, { name: x.title, path: 'services/' + x.slug }]),
        { '@context': 'https://schema.org', '@type': 'Service', name: x.title, description: x.tagline,
          url: base + '/services/' + x.slug, provider: { '@id': base + '/#organization' },
          areaServed: { '@type': 'Country', name: 'India' }, serviceType: x.title },
        P.faqSchema(x.faqs)
      ], body: body });
  }

  /* =========================== INDUSTRIES =========================== */
  function industriesIndex(D) {
    var cr = [{ name: 'Home', file: 'index.html' }, { name: 'Industries', file: 'industries/index.html' }];
    var body = P.pageHead(1, cr, 'Where we work.',
      'Healthcare is where our evidence is deepest, because we build from inside a working clinic. The others share the same underlying problem in different clothes.') +
      '<section class="section-tight"><div class="container"><div class="grid g2">' +
      D.industries.map(function (x) {
        return card(x.slug + '.html', '<div class="icon-bubble">' + icon(x.icon) + '</div><h3>' + esc(x.title) + '</h3>' +
          '<p>' + esc(x.tagline) + '</p>' + P.checkList((x.problems || []).slice(0, 3), 'arrow') +
          '<span class="card-cta">Explore &rarr;</span>');
      }).join('') + '</div></div></section>' + P.ctaBand(1, 'Working in one of these?', 'We will tell you what we have seen work and what we have seen fail.');
    return P.shell(D, { depth: 1, path: 'industries', current: 'industries',
      title: 'AI for Healthcare, Hotels & Manufacturing',
      description: 'How GooseLabs applies AI and automation in healthcare, hospitality, manufacturing, membership communities, creator teams and Indian SMEs.',
      schema: [P.crumbs(D, [{ name: 'Home', path: '' }, { name: 'Industries', path: 'industries' }])], body: body });
  }

  function industryPage(D, x) {
    var cr = [{ name: 'Home', file: 'index.html' }, { name: 'Industries', file: 'industries/index.html' }, { name: x.title, file: '' }];
    var svc = (x.services || []).map(function (sl) {
      return D.services.filter(function (s) { return s.slug === sl; })[0]; }).filter(Boolean);
    var work = D.work.filter(function (w) { return w.industry === x.slug; });
    var body = P.pageHead(1, cr, x.title, x.tagline) +
(x.problems && x.problems.length ? '<section class="section-tight"><div class="container"><div class="card tinted">' +
  '<h3>What we keep finding in this sector</h3>' + P.checkList(x.problems, 'arrow') + '</div></div></section>' : '') +
'<section class="section-tight"><div class="container"><div class="prose">' + md(x.body) + '</div></div></section>' +
(svc.length ? '<section class="section-tight"><div class="container"><div class="kicker">Where we usually start</div>' +
  '<h2 style="margin-bottom:24px">Services that fit this sector.</h2><div class="grid g3">' +
  svc.map(function (s) { return card('../services/' + s.slug + '.html',
    '<div class="icon-bubble">' + icon(s.icon) + '</div><h3>' + esc(s.title) + '</h3><p>' + esc(s.tagline) + '</p><span class="card-cta">Read more &rarr;</span>'); }).join('') +
  '</div></div></section>' : '') +
(work.length ? '<section class="section-tight"><div class="container"><div class="kicker">Proof</div>' +
  '<h2 style="margin-bottom:24px">Built for this sector.</h2><div class="grid g3">' +
  work.map(function (w) { return card('../work/' + w.slug + '.html',
    '<span class="eyebrow">' + esc(w.status) + '</span><h3>' + esc(w.title) + '</h3><p>' + esc(w.tagline) + '</p><span class="card-cta">Read the case study &rarr;</span>'); }).join('') +
  '</div></div></section>' : '') +
P.ctaBand(1, 'Working in ' + x.title + '?', 'A short call about your operation, with no pitch deck.');
    return P.shell(D, { depth: 1, path: 'industries/' + x.slug, current: 'industries', seo: x.seo,
      title: x.seoTitle || x.title, description: x.seoDescription || x.tagline,
      schema: [P.crumbs(D, [{ name: 'Home', path: '' }, { name: 'Industries', path: 'industries' }, { name: x.title, path: 'industries/' + x.slug }])],
      body: body });
  }

  /* ============================== WORK ============================== */
  function workIndex(D) {
    var cr = [{ name: 'Home', file: 'index.html' }, { name: 'Work', file: 'work/index.html' }];
    var body = P.pageHead(1, cr, 'Case studies.', 'Named clients, real systems, and an honest account of what we would do differently.') +
      '<section class="section-tight"><div class="container"><div class="grid g3">' +
      D.work.map(function (w) {
        return card(w.slug + '.html', '<span class="eyebrow">' + esc(w.status) + '</span><h3>' + esc(w.title) + '</h3>' +
          '<p class="meta">' + esc(w.client) + '</p><p>' + esc(w.tagline) + '</p><div class="tags">' +
          (w.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') +
          '</div><span class="card-cta">Read the case study &rarr;</span>');
      }).join('') + '</div></div></section>' + P.ctaBand(1, 'Have a problem that looks like one of these?', 'Tell us about it.');
    return P.shell(D, { depth: 1, path: 'work', current: 'work',
      title: 'Case Studies — AI Systems in Production',
      description: 'Case studies from GooseLabs: a digital patient journey at Pranaa clinic, the WhatsOn community app for Yi Raipur, and MediScribe AI clinical documentation.',
      schema: [P.crumbs(D, [{ name: 'Home', path: '' }, { name: 'Work', path: 'work' }])], body: body });
  }

  function workPage(D, w) {
    var cr = [{ name: 'Home', file: 'index.html' }, { name: 'Work', file: 'work/index.html' }, { name: w.title, file: '' }];
    var others = D.work.filter(function (o) { return o.slug !== w.slug; }).slice(0, 2);
    var base = D.site.url.replace(/\/$/, '');
    var results = (w.results || []).map(function (r) {
      var val = isTodo(String(r.value)) ? '<span class="todo">Pending measurement</span>' : esc(r.value);
      return '<div class="card stat-card"><strong>' + val + '</strong><span>' + esc(r.label) + '</span>' +
        (r.verified ? '' : '<span class="todo">not yet verified</span>') + '</div>';
    }).join('');
    var img = (w.image && !isTodo(w.image))
      ? '<img src="../images/' + esc(w.image) + '" alt="' + esc(w.imageAlt) + '" loading="lazy" width="1200" height="700">'
      : '<div class="card dashed center"><p class="todo">Screenshot slot &mdash; drop an image into the <code>images</code> folder and name it in the editor. Alt text is already written: &ldquo;' + esc(w.imageAlt) + '&rdquo;</p></div>';

    var body = P.pageHead(1, cr, w.title, w.tagline, w.status + ' · ' + w.year) +
      '<p class="container meta" style="margin-top:-14px">' + esc(w.client) + '</p>' +
      (results ? '<section class="section-tight"><div class="container"><div class="grid g4">' + results + '</div></div></section>' : '') +
      '<section class="section-tight"><div class="container">' + img + '</div></section>' +
      '<section class="section-tight"><div class="container"><div class="prose">' + md(w.body) + '</div></div></section>' +
      '<section class="section-tight"><div class="container"><h2 style="margin-bottom:24px">More work</h2><div class="grid g2">' +
      others.map(function (o) { return card(o.slug + '.html', '<h3>' + esc(o.title) + '</h3><p>' + esc(o.tagline) + '</p><span class="card-cta">Read &rarr;</span>'); }).join('') +
      '</div></div></section>' + P.ctaBand(1, 'Have a problem that looks like this one?', 'A short call, no pitch deck.');

    return P.shell(D, { depth: 1, path: 'work/' + w.slug, current: 'work', type: 'article', seo: w.seo,
      title: w.seoTitle || w.title, description: w.seoDescription || w.tagline,
      schema: [P.crumbs(D, [{ name: 'Home', path: '' }, { name: 'Work', path: 'work' }, { name: w.title, path: 'work/' + w.slug }]),
        { '@context': 'https://schema.org', '@type': 'Article', headline: w.title, description: w.tagline,
          url: base + '/work/' + w.slug, author: { '@id': base + '/#organization' }, publisher: { '@id': base + '/#organization' } }],
      body: body });
  }

  /* ============================ INSIGHTS ============================ */
  function insightsIndex(D) {
    var cr = [{ name: 'Home', file: 'index.html' }, { name: 'Insights', file: 'insights/index.html' }];
    var body = P.pageHead(1, cr, 'Insights.', 'Written from what we have built and what has gone wrong, not from a content calendar.') +
      '<section class="section-tight"><div class="container"><div class="grid g3">' +
      D.insights.map(function (p) {
        return card(p.slug + '.html', '<span class="meta">' + esc(fmtDate(p.date)) + ' &middot; ' + esc(p.readingTime) + ' min read</span>' +
          '<h3>' + esc(p.title) + '</h3><p>' + esc(p.excerpt) + '</p><div class="tags">' +
          (p.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') +
          '</div><span class="card-cta">Read &rarr;</span>');
      }).join('') + '</div></div></section>' + P.ctaBand(1, 'Want this applied to your business?', 'Tell us what you are trying to fix.');
    return P.shell(D, { depth: 1, path: 'insights', current: 'insights',
      title: 'Insights on AI Adoption in Indian Business',
      description: 'Practical writing on AI adoption, WhatsApp-first automation and clinical AI in India, written from the builds rather than the brochure.',
      schema: [P.crumbs(D, [{ name: 'Home', path: '' }, { name: 'Insights', path: 'insights' }])], body: body });
  }

  function insightPage(D, p) {
    var cr = [{ name: 'Home', file: 'index.html' }, { name: 'Insights', file: 'insights/index.html' }, { name: (p.seo && p.seo.breadcrumbTitle) || p.title, file: '' }];
    var more = D.insights.filter(function (o) { return o.slug !== p.slug; }).slice(0, 2);
    var base = D.site.url.replace(/\/$/, '');
    var body = '<div class="container page-head">' + P.breadcrumbHtml(1, cr) +
      '<h1 class="h1-article">' + esc(p.title) + '</h1>' +
      '<p class="meta">' + esc(p.author) + ' &middot; <time datetime="' + esc(p.date) + '">' + esc(fmtDate(p.date)) + '</time> &middot; ' + esc(p.readingTime) + ' min read</p></div>' +
      '<article class="section-tight"><div class="container"><div class="prose">' + md(p.body) + '</div></div></article>' +
      '<section class="section-tight"><div class="container"><h2 style="margin-bottom:24px">More insights</h2><div class="grid g2">' +
      more.map(function (o) { return card(o.slug + '.html', '<h3>' + esc(o.title) + '</h3><p>' + esc(o.excerpt) + '</p><span class="card-cta">Read &rarr;</span>'); }).join('') +
      '</div></div></section>' + P.ctaBand(1, 'Want this applied to your business?', 'A short call about your operation.');
    return P.shell(D, { depth: 1, path: 'insights/' + p.slug, current: 'insights', type: 'article', seo: p.seo,
      publishedTime: p.date, author: p.author, tags: p.tags,
      title: p.seoTitle || p.title, description: p.seoDescription || p.excerpt,
      schema: [P.crumbs(D, [{ name: 'Home', path: '' }, { name: 'Insights', path: 'insights' }, { name: p.title, path: 'insights/' + p.slug }]),
        { '@context': 'https://schema.org',
          '@type': (p.seo && p.seo.schemaArticleType) || 'BlogPosting',
          headline: p.title, description: p.excerpt, url: base + '/insights/' + p.slug,
          datePublished: p.date, dateModified: p.date,
          wordCount: String(p.body || '').split(/\s+/).length,
          keywords: [(p.seo && p.seo.focusKeyphrase) || ''].concat((p.seo && p.seo.relatedKeyphrases) || []).filter(Boolean).join(', '),
          author: { '@type': 'Person', name: p.author },
          publisher: { '@id': base + '/#organization' },
          mainEntityOfPage: { '@type': 'WebPage', '@id': base + '/insights/' + p.slug },
          image: base + '/' + ((p.seo && p.seo.og && p.seo.og.image) || 'og.png') }],
      body: body });
  }


  /* ============================== ABOUT ============================== */
  function about(D) {
    var s = D.site, base = s.url.replace(/\/$/, '');
    var cr = [{ name: 'Home', file: 'index.html' }, { name: 'About', file: 'about.html' }];
    var principles = [
      ['compass', 'We will tell you not to build', 'Our discovery sprint is designed to be able to conclude that nothing should be built yet. A client who builds the right thing next year is worth more than one who builds the wrong thing now.'],
      ['users', 'Adoption is a design problem', 'Systems fail because people go around them, not because the model was weak. We build where people already work, which in India usually means WhatsApp.'],
      ['chart', 'Ship in weeks, not quarters', 'Something usable in four to six weeks, then fortnightly. Long silent builds produce platforms nobody asked for.'],
      ['link', 'You own what we build', 'Repository, documentation, deployment. Vendor lock-in is a poor way to keep a client.']
    ];
    var photo = (s.founder.photo && !isTodo(s.founder.photo))
      ? '<img class="portrait" src="images/' + esc(s.founder.photo) + '" alt="' + esc(s.founder.name) + ', founder of GooseLabs" loading="lazy" width="600" height="600">'
      : '<div class="dashed center pad"><p class="todo">Founder photo slot &mdash; add an image to the <code>images</code> folder and name it in the editor.</p></div>';
    var li = isTodo(s.founder.linkedin) ? '<p class="todo">Add a LinkedIn URL in the editor</p>'
      : '<a class="btn btn-secondary btn-sm" href="' + esc(s.founder.linkedin) + '" target="_blank" rel="noopener">LinkedIn &rarr;</a>';

    var body = P.pageHead(0, cr, 'An AI studio that builds from inside the business.',
      'GooseLabs is based in Raipur, Chhattisgarh. We build AI systems, automations and products for organisations that run on scattered information — and we do it close enough to the operation to know when something is not working.') +
'<section class="section-tight"><div class="container"><div class="grid g2 start">' +
  '<div class="prose wide">' +
    '<h2>Why we exist</h2>' +
    '<p>Most Indian mid-market businesses are not short of software. They are short of connection between the software they already have &mdash; and short of anyone who will tell them honestly which problems technology can actually solve.</p>' +
    '<p>We started inside healthcare, at <strong>Pr&#257;naa</strong>, a regenerative medicine and longevity clinic in Shankar Nagar, Raipur, where our founder is technology lead. Building a patient platform while also being accountable for whether the clinic runs well is a very different experience from delivering to a specification. It teaches you quickly that the best design is the one the front desk will still be using in month three.</p>' +
    '<h2>How we work</h2>' +
    '<p>Discovery on your floor, not in a workshop. A build sequence that starts with the process that hurts most. Releases every fortnight that your team can use immediately. And a named internal owner before anything launches, because systems without owners quietly die.</p>' +
    '<h2>What we are still figuring out</h2>' +
    '<p>We are a young studio. Our healthcare evidence is deeper than our manufacturing evidence, and we would rather say that than imply otherwise. If your problem sits somewhere we have not worked before, we will tell you what we do and do not know before you commit anything.</p>' +
  '</div>' +
  '<div><div class="card" style="margin-bottom:18px">' + photo +
    '<h3 style="margin-top:16px">' + esc(s.founder.name) + '</h3>' +
    '<p class="meta">' + esc(s.founder.jobTitle) + '</p>' +
    '<p>MSc in AI &amp; Data Science. Technology lead at Pr&#257;naa, where he built the clinic&rsquo;s digital patient journey. Builds AI systems, automations and products for businesses across central India.</p>' +
    li + '</div>' +
    '<div class="card"><h3>The team</h3>' +
      P.checkList(['Product and engineering', 'AI and ML integration', 'Mobile and web development', 'Data pipelines and automation']) +
      '<p class="todo">Confirm current headcount and registration status before publishing.</p></div>' +
  '</div>' +
'</div></div></section>' +
'<section class="section-tight"><div class="container"><div class="kicker">How we operate</div>' +
  '<h2 style="margin-bottom:24px">Four things we hold to.</h2><div class="grid g2">' +
  principles.map(function (p3) {
    return '<div class="card"><div class="icon-bubble">' + icon(p3[0]) + '</div><h3>' + esc(p3[1]) + '</h3><p>' + esc(p3[2]) + '</p></div>';
  }).join('') + '</div></div></section>' +
P.ctaBand(0, 'Want to talk about your operation?', 'A short call, no pitch deck.');

    return P.shell(D, { depth: 0, path: 'about', current: 'about',
      title: 'About GooseLabs — AI Product Studio, Raipur',
      description: 'GooseLabs is an AI product studio in Raipur founded by Palash Kanwar, MSc AI & Data Science and technology lead at Pranaa. What we believe and how we work.',
      schema: [P.crumbs(D, [{ name: 'Home', path: '' }, { name: 'About', path: 'about' }]),
        { '@context': 'https://schema.org', '@type': 'Person', name: s.founder.name, jobTitle: s.founder.jobTitle,
          description: s.founder.alsoKnownFor, worksFor: { '@id': base + '/#organization' }, url: base + '/about',
          knowsAbout: ['Artificial Intelligence', 'Data Science', 'Healthcare Technology', 'Workflow Automation'] }],
      body: body });
  }

  /* ============================= CONTACT ============================= */
  function contact(D) {
    var s = D.site, a = s.address;
    var cr = [{ name: 'Home', file: 'index.html' }, { name: 'Contact', file: 'contact.html' }];
    var phone = isTodo(s.phone) ? '<span class="todo">Add a phone number in the editor</span>'
      : '<a href="tel:' + esc(s.phone) + '">' + esc(s.phone) + '</a>';
    var wa = isTodo(s.whatsapp) ? '<span class="todo">Add a WhatsApp number in the editor</span>'
      : '<a href="https://wa.me/' + String(s.whatsapp).replace(/[^0-9]/g, '') + '" target="_blank" rel="noopener">Message us on WhatsApp</a>';
    var street = isTodo(a.street) ? '<span class="todo">Add a street address</span>' : esc(a.street);

    var options = D.services.map(function (x) { return '<option>' + esc(x.title) + '</option>'; }).join('');

    var body = P.pageHead(0, cr, 'Let’s talk.',
      'Tell us what is actually going wrong day to day. We reply to everything, and if we are not the right people for it we will say so.') +
'<section class="section-tight"><div class="container"><div class="grid g2 start">' +
  '<form class="card" id="leadForm" action="' + esc(s.formEndpoint || '') + '" method="POST">' +
    '<h3>Tell us what you are trying to fix</h3>' +
    '<p class="muted small" style="margin-bottom:20px">The more specific the problem, the more useful our first reply will be.</p>' +
    '<div class="grid g2 tight">' +
      '<label class="field"><span>Name</span><input name="name" required autocomplete="name"></label>' +
      '<label class="field"><span>Company</span><input name="company" autocomplete="organization"></label>' +
      '<label class="field"><span>Email</span><input name="email" type="email" required autocomplete="email"></label>' +
      '<label class="field"><span>WhatsApp number</span><input name="whatsapp" type="tel" placeholder="+91" autocomplete="tel"></label>' +
    '</div>' +
    '<label class="field"><span>What are you interested in?</span><select name="interest"><option value="">Not sure yet</option>' + options + '</select></label>' +
    '<label class="field"><span>What is the problem?</span><textarea name="message" required placeholder="For example: our doctors spend two hours a day writing notes after clinic hours."></textarea></label>' +
    '<button type="submit" class="btn btn-primary">Send enquiry</button>' +
    '<div id="formStatus"></div>' +
    '<p class="muted small" style="margin-top:10px">We reply to everything. If we do not think we are the right people for the job, we will say so and try to point you somewhere better.</p>' +
  '</form>' +
  '<div>' +
    '<div class="card" style="margin-bottom:18px"><h3>Direct</h3><ul class="check-list contact-list">' +
      '<li>' + icon('mail', 17) + '<span><a href="mailto:' + esc(s.email) + '">' + esc(s.email) + '</a></span></li>' +
      '<li>' + icon('phone', 17) + '<span>' + phone + '</span></li>' +
      '<li>' + T.waIcon(17) + '<span>' + wa + '</span></li>' +
      '<li>' + icon('pin', 17) + '<span>' + street + '<br>' + esc(a.locality) + ', ' + esc(a.city) + '<br>' + esc(a.region) + ' ' + esc(a.postalCode) + ', India</span></li>' +
    '</ul></div>' +
    '<div class="card"><h3>What happens next</h3>' +
      P.checkList([
        'We reply within one working day, usually on WhatsApp if you gave us a number.',
        'A 30-minute call about the problem — no deck, no demo.',
        'If it looks like a fit, we propose a discovery sprint or a scoped build.',
        'If it does not, we say so and point you somewhere better.'
      ], 'arrow') + '</div>' +
  '</div>' +
'</div></div></section>';

    return P.shell(D, { depth: 0, path: 'contact', current: 'contact',
      title: 'Contact GooseLabs — Raipur, Chhattisgarh',
      description: 'Talk to GooseLabs about AI automation, clinical AI, dashboards or a product build. Based in Raipur, working with clients across India.',
      schema: [P.crumbs(D, [{ name: 'Home', path: '' }, { name: 'Contact', path: 'contact' }])], body: body });
  }

  /* ============================== 404 ============================== */
  function notFound(D) {
    var body = '<section class="section center" style="padding:90px 0">' +
      '<div class="container"><span class="eyebrow">404</span>' +
      '<h1 style="margin:18px 0 16px">That page does not exist.</h1>' +
      '<p class="lead" style="margin:0 auto 28px">It may have moved, or the link may be wrong. Everything we publish is listed in the sitemap.</p>' +
      '<div class="btn-row center-row"><a href="index.html" class="btn btn-primary">Back to home</a>' +
      '<a href="services/index.html" class="btn btn-secondary">Browse services</a>' +
      '<a href="contact.html" class="btn btn-ghost">Contact us</a></div></div></section>';
    return P.shell(D, { depth: 0, path: '404', current: '', noindex: true,
      title: 'Page not found', description: 'That page does not exist on the GooseLabs website.', body: body });
  }

  /* ====================== sitemap.xml & robots.txt ====================== */
  function sitemap(D) {
    var base = D.site.url.replace(/\/$/, '');
    var today = new Date().toISOString().slice(0, 10);
    var urls = [
      { p: '', pr: '1.0', cf: 'monthly' },
      { p: 'about', pr: '0.8', cf: 'monthly' },
      { p: 'services', pr: '0.8', cf: 'monthly' },
      { p: 'industries', pr: '0.8', cf: 'monthly' },
      { p: 'work', pr: '0.8', cf: 'monthly' },
      { p: 'insights', pr: '0.8', cf: 'monthly' },
      { p: 'contact', pr: '0.8', cf: 'monthly' }
    ];
    D.services.forEach(function (x) { urls.push({ p: 'services/' + x.slug, pr: '0.9', cf: 'monthly' }); });
    D.industries.forEach(function (x) { urls.push({ p: 'industries/' + x.slug, pr: '0.8', cf: 'monthly' }); });
    D.work.forEach(function (x) { urls.push({ p: 'work/' + x.slug, pr: '0.7', cf: 'yearly' }); });
    D.insights.forEach(function (x) { urls.push({ p: 'insights/' + x.slug, pr: '0.6', cf: 'yearly', lm: x.date }); });

    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls.map(function (u) {
        return '  <url>\n    <loc>' + base + (u.p ? '/' + u.p : '/') + '</loc>\n' +
          '    <lastmod>' + (u.lm || today) + '</lastmod>\n' +
          '    <changefreq>' + u.cf + '</changefreq>\n' +
          '    <priority>' + u.pr + '</priority>\n  </url>';
      }).join('\n') + '\n</urlset>\n';
  }

  function robots(D) {
    var base = D.site.url.replace(/\/$/, '');
    return 'User-agent: *\nAllow: /\nDisallow: /admin.html\n\n' +
      '# Answer engines are a real referral source for B2B AI services.\n' +
      'User-agent: GPTBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\n' +
      'Sitemap: ' + base + '/sitemap.xml\n';
  }

  return { home: home, about: about, contact: contact, notFound: notFound, sitemap: sitemap, robots: robots,
    servicesIndex: servicesIndex, servicePage: servicePage,
    industriesIndex: industriesIndex, industryPage: industryPage,
    workIndex: workIndex, workPage: workPage,
    insightsIndex: insightsIndex, insightPage: insightPage, fmtDate: fmtDate, card: card };
});
