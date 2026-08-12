/* ==========================================================================
   GooseLabs — page builders. Plain JavaScript, no frameworks.
   Every page is produced here, so the CMS and the generator can never drift.
   ========================================================================== */
(function (root, factory) {
  var T = (typeof require !== 'undefined' && typeof module !== 'undefined')
    ? require('./templates.js') : window.TEMPLATES;
  var api = factory(T);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.PAGES = api;
})(this, function (T) {
  'use strict';
  var esc = T.esc, md = T.md, icon = T.icon, isTodo = T.isTodo, up = T.up;

  var NAV = [
    { href: 'services/index.html', label: 'Services', key: 'services' },
    { href: 'industries/index.html', label: 'Industries', key: 'industries' },
    { href: 'work/index.html', label: 'Work', key: 'work' },
    { href: 'insights/index.html', label: 'Insights', key: 'insights' },
    { href: 'about.html', label: 'About', key: 'about' }
  ];

  function nav(depth, current, D) {
    var u = up(depth);
    var links = NAV.map(function (l) {
      return '<a href="' + u + l.href + '"' + (l.key === current ? ' aria-current="page"' : '') + '>' + l.label + '</a>';
    }).join('');
    return '' +
'<div class="nav-wrap"><div class="container"><nav class="nav" aria-label="Main">' +
  '<a href="' + u + 'index.html" class="brand" aria-label="' + esc(D.site.brand) + ' home">' + brandMark(D, u) + '<span>' + esc(D.site.brand) + '</span></a>' +
  '<div class="nav-links">' + links + '</div>' +
  '<div class="nav-right">' +
    themeToggle() +
    '<a href="' + u + 'contact.html" class="btn btn-primary btn-sm">Book a call</a>' +
    '<button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="mobileMenu" aria-label="Menu">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>' +
    '</button>' +
  '</div>' +
'</nav><div class="mobile-menu" id="mobileMenu" hidden>' +
  NAV.map(function (l) { return '<a href="' + u + l.href + '">' + l.label + '</a>'; }).join('') +
  '<a href="' + u + 'contact.html">Contact</a>' +
  '<a href="' + u + 'contact.html" class="btn btn-primary menu-cta">Book a call</a>' +
  '<button type="button" class="menu-theme" id="themeToggleM">' +
    '<span class="only-light-t">Switch to dark mode</span><span class="only-dark-t">Switch to light mode</span>' +
  '</button>' +
'</div></div></div>';
  }

  /* the real GooseLabs logo, with a light variant swapped in by CSS in dark mode */
  function brandMark(D, u) {
    return '<span class="brand-logo">' +
      '<img class="only-light" src="' + u + esc(D.site.mark || 'images/mark.png') + '" alt="" width="34" height="34" decoding="async">' +
      '<img class="only-dark" src="' + u + esc(D.site.markLight || 'images/mark-light.png') + '" alt="" width="34" height="34" decoding="async">' +
    '</span>';
  }

  function themeToggle() {
    return '<button class="theme-toggle" id="themeToggle" type="button" aria-label="Switch between light and dark mode" title="Light / dark mode">' +
      '<svg class="ic-sun" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>' +
      '<svg class="ic-moon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>' +
    '</button>';
  }

  function footer(D, depth) {
    var u = up(depth), s = D.site, a = s.address;
    var phone = isTodo(s.phone)
      ? '<span class="todo">Add a phone number in the editor</span>'
      : '<a href="tel:' + esc(s.phone) + '">' + esc(s.phone) + '</a>';
    var street = isTodo(a.street) ? '<span class="todo">Add a street address</span>' : esc(a.street);
    return '' +
'<footer class="footer"><div class="container"><div class="footer-grid">' +
  '<div><div class="brand" style="margin-bottom:12px">' + brandMark(D, u) + '<span>' + esc(s.brand) + '</span></div>' +
    '<p class="muted small" style="max-width:34ch;margin-bottom:16px">' + esc(s.shortDescription) + '</p>' +
    '<address>' +
      '<span>' + icon('mail', 16) + '<a href="mailto:' + esc(s.email) + '">' + esc(s.email) + '</a></span>' +
      '<span>' + icon('phone', 16) + phone + '</span>' +
      '<span>' + icon('pin', 16) + '<span>' + street + '<br>' + esc(a.locality) + ', ' + esc(a.city) + ', ' + esc(a.region) + ' ' + esc(a.postalCode) + '</span></span>' +
    '</address></div>' +
  '<div><h4>Services</h4><ul>' + D.services.map(function (x) {
      return '<li><a href="' + u + 'services/' + x.slug + '.html">' + esc(x.title) + '</a></li>'; }).join('') + '</ul></div>' +
  '<div><h4>Industries</h4><ul>' + D.industries.map(function (x) {
      return '<li><a href="' + u + 'industries/' + x.slug + '.html">' + esc(x.title) + '</a></li>'; }).join('') + '</ul></div>' +
  '<div><h4>Company</h4><ul>' +
    '<li><a href="' + u + 'about.html">About</a></li>' +
    '<li><a href="' + u + 'work/index.html">Case studies</a></li>' +
    '<li><a href="' + u + 'insights/index.html">Insights</a></li>' +
    '<li><a href="' + u + 'contact.html">Contact</a></li>' +
  '</ul></div>' +
'</div><div class="footer-base">' +
  '<span>&copy; ' + new Date().getFullYear() + ' ' + esc(s.legalName) + '. Raipur, Chhattisgarh, India.</span>' +
  '<span class="footer-end">AI systems &middot; Automation &middot; Product &middot; Data' +
    '<a class="admin-link" href="' + u + 'admin.html" rel="nofollow noopener" title="Edit this website">Admin</a></span>' +
'</div></div></footer>';
  }

  function waFab(D) {
    var w = D.site.whatsapp;
    if (!w || isTodo(w)) return '';
    return '<a class="wa-fab" href="https://wa.me/' + String(w).replace(/[^0-9]/g, '') +
      '?text=' + encodeURIComponent('Hi ' + D.site.brand + ', I came from your website.') +
      '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">' + T.waIcon(26) + '</a>';
  }

  /* ---------- document shell: this is where all the SEO lives ---------- */
  function shell(D, o) {
    var u = up(o.depth), s = D.site, S = s.seo || {};
    var base = (s.url || 'https://gooselabs.in').replace(/\/$/, '');
    var seo = o.seo || {};
    var canonical = seo.canonical ? seo.canonical : base + '/' + (o.path || '');
    var sep = S.titleSeparator || '|';
    var title = o.title.toLowerCase().indexOf(String(s.brand).toLowerCase()) > -1
      ? o.title : o.title + ' ' + sep + ' ' + s.brand;

    /* robots directives, per page, Yoast style */
    var r = seo.robots || {};
    var robots = [];
    if (o.noindex || r.index === false) robots.push('noindex'); else robots.push('index');
    robots.push(r.follow === false ? 'nofollow' : 'follow');
    if (r.noimageindex) robots.push('noimageindex');
    if (r.noarchive) robots.push('noarchive');
    if (r.nosnippet) robots.push('nosnippet');
    if (!r.nosnippet) {
      robots.push('max-snippet:' + (r.maxSnippet || '-1'));
      robots.push('max-image-preview:' + (r.maxImagePreview || 'large'));
      robots.push('max-video-preview:-1');
    }

    /* social overrides fall back to the page values */
    var og = seo.og || {}, tw = seo.twitter || {};
    var ogTitle = og.title || title;
    var ogDesc  = og.description || o.description;
    var ogImg   = base + '/' + (og.image || S.defaultOgImage || 'og.png');
    var twTitle = tw.title || ogTitle;
    var twDesc  = tw.description || ogDesc;
    var twImg   = tw.image ? base + '/' + tw.image : ogImg;

    var ld = (o.schema || []).filter(Boolean).map(function (x) {
      return '<script type="application/ld+json">' + JSON.stringify(x) + '</script>';
    }).join('\n  ');

    /* verification + analytics, all optional and driven from the editor */
    var v = S.verification || {}, extra = '';
    if (v.google)    extra += '\n  <meta name="google-site-verification" content="' + esc(v.google) + '">';
    if (v.bing)      extra += '\n  <meta name="msvalidate.01" content="' + esc(v.bing) + '">';
    if (v.pinterest) extra += '\n  <meta name="p:domain_verify" content="' + esc(v.pinterest) + '">';
    if (v.yandex)    extra += '\n  <meta name="yandex-verification" content="' + esc(v.yandex) + '">';

    var an = S.analytics || {}, tags = '';
    if (an.gtm) {
      tags += '\n<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});' +
        'var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;' +
        'j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);})' +
        '(window,document,"script","dataLayer","' + esc(an.gtm) + '");</script>';
    }
    if (an.ga4) {
      tags += '\n<script async src="https://www.googletagmanager.com/gtag/js?id=' + esc(an.ga4) + '"></script>' +
        '\n<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}' +
        'gtag("js",new Date());gtag("config","' + esc(an.ga4) + '");</script>';
    }
    if (an.clarity) {
      tags += '\n<script>(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};' +
        't=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;' +
        'y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","' + esc(an.clarity) + '");</script>';
    }

    return '<!doctype html>\n<html lang="en-IN">\n<head>\n' +
'  <meta charset="utf-8">\n' +
'  <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
'  <meta name="theme-color" content="#f7f3ea" media="(prefers-color-scheme: light)">\n' +
'  <meta name="theme-color" content="#101722" media="(prefers-color-scheme: dark)">\n' +
'  <script>(function(){try{var t=localStorage.getItem("gl-theme");' +
     'if(!t)t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";' +
     'document.documentElement.setAttribute("data-theme",t);}catch(e){}})();</script>\n' +
'  <title>' + esc(title) + '</title>\n' +
'  <meta name="description" content="' + esc(o.description) + '">\n' +
'  <link rel="canonical" href="' + esc(canonical) + '">\n' +
'  <meta name="robots" content="' + robots.join(', ') + '">\n' +
(seo.focusKeyphrase ? '  <meta name="keywords" content="' + esc([seo.focusKeyphrase].concat(seo.relatedKeyphrases || []).join(', ')) + '">\n' : '') +
'  <meta property="og:type" content="' + (o.type || 'website') + '">\n' +
'  <meta property="og:site_name" content="' + esc(s.brand) + '">\n' +
'  <meta property="og:locale" content="en_IN">\n' +
'  <meta property="og:title" content="' + esc(ogTitle) + '">\n' +
'  <meta property="og:description" content="' + esc(ogDesc) + '">\n' +
'  <meta property="og:url" content="' + esc(canonical) + '">\n' +
'  <meta property="og:image" content="' + esc(ogImg) + '">\n' +
'  <meta property="og:image:width" content="1200">\n' +
'  <meta property="og:image:height" content="630">\n' +
'  <meta property="og:image:alt" content="' + esc(s.brand + ' — ' + s.shortDescription) + '">\n' +
(o.publishedTime ? '  <meta property="article:published_time" content="' + esc(o.publishedTime) + '">\n' : '') +
(o.author ? '  <meta property="article:author" content="' + esc(o.author) + '">\n' : '') +
(o.tags || []).map(function (t) { return '  <meta property="article:tag" content="' + esc(t) + '">\n'; }).join('') +
'  <meta name="twitter:card" content="summary_large_image">\n' +
(S.twitterHandle ? '  <meta name="twitter:site" content="' + esc(S.twitterHandle) + '">\n' : '') +
'  <meta name="twitter:title" content="' + esc(twTitle) + '">\n' +
'  <meta name="twitter:description" content="' + esc(twDesc) + '">\n' +
'  <meta name="twitter:image" content="' + esc(twImg) + '">\n' +
'  <link rel="icon" href="' + u + 'favicon.ico" sizes="any">\n' +
'  <link rel="icon" type="image/png" sizes="32x32" href="' + u + 'favicon-32.png">\n' +
'  <link rel="icon" type="image/png" sizes="192x192" href="' + u + 'favicon-192.png">\n' +
'  <link rel="apple-touch-icon" href="' + u + 'apple-touch-icon.png">\n' +
'  <link rel="stylesheet" href="' + u + 'styles.css">' + extra + '\n' +
'  ' + ld + '\n' +
'</head>\n<body>' + tags + '\n' +
'<a href="#main" class="skip-link">Skip to content</a>\n' +
nav(o.depth, o.current, D) +
'<main id="main">\n' + o.body + '\n</main>\n' +
footer(D, o.depth) + waFab(D) +
'\n<script src="' + u + 'site.js"></script>\n</body>\n</html>\n';
  }

  /* ---------- schema builders ---------- */
  function orgSchema(D) {
    var s = D.site, base = s.url.replace(/\/$/, ''), a = s.address;
    return {
      '@context': 'https://schema.org', '@type': 'ProfessionalService', '@id': base + '/#organization',
      name: s.brand, legalName: s.legalName, url: base, email: s.email, description: s.description,
      logo: { '@type': 'ImageObject', url: base + '/logo.svg' }, image: base + '/og.png',
      areaServed: [{ '@type': 'Country', name: 'India' }],
      address: { '@type': 'PostalAddress', streetAddress: a.street, addressLocality: a.city, addressRegion: a.region, postalCode: a.postalCode, addressCountry: a.country },
      geo: { '@type': 'GeoCoordinates', latitude: s.geo.lat, longitude: s.geo.lng },
      founder: { '@type': 'Person', name: s.founder.name, jobTitle: s.founder.jobTitle },
      knowsAbout: ['AI automation', 'Clinical documentation AI', 'Business intelligence', 'Computer vision', 'MVP development']
    };
  }
  function crumbs(D, items) {
    var base = D.site.url.replace(/\/$/, '');
    return { '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: items.map(function (c, i) {
        return { '@type': 'ListItem', position: i + 1, name: c.name, item: base + '/' + c.path }; }) };
  }
  function faqSchema(faqs) {
    if (!faqs || !faqs.length) return null;
    return { '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faqs.map(function (f) {
        return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }; }) };
  }

  /* ---------- shared blocks ---------- */
  function breadcrumbHtml(depth, items) {
    var u = up(depth);
    return '<nav class="breadcrumbs" aria-label="Breadcrumb">' + items.map(function (c, i) {
      var sep = i > 0 ? '<span aria-hidden="true">/</span>' : '';
      return sep + (i === items.length - 1
        ? '<span aria-current="page">' + esc(c.name) + '</span>'
        : '<a href="' + u + c.file + '">' + esc(c.name) + '</a>');
    }).join('') + '</nav>';
  }
  function ctaBand(depth, title, body) {
    var u = up(depth);
    return '<section class="section"><div class="container"><div class="cta-band">' +
      '<div><h2>' + esc(title) + '</h2><p class="lead small">' + esc(body) + '</p></div>' +
      '<div class="cta-actions"><a href="' + u + 'contact.html" class="btn btn-primary">Book a call</a>' +
      '<a href="' + u + 'work/index.html" class="btn btn-secondary">See our work</a></div>' +
      '</div></div></section>';
  }
  function faqBlock(faqs) {
    if (!faqs || !faqs.length) return '';
    return '<section class="section"><div class="container"><div class="narrow">' +
      '<h2 style="margin-bottom:22px">Common questions</h2><div class="faq">' +
      faqs.map(function (f) {
        return '<details><summary>' + esc(f.q) + '</summary><p>' + esc(f.a) + '</p></details>'; }).join('') +
      '</div></div></div></section>';
  }
  function checkList(items, ic) {
    return '<ul class="check-list">' + (items || []).map(function (x) {
      return '<li>' + icon(ic || 'check', 17) + '<span>' + esc(x) + '</span></li>'; }).join('') + '</ul>';
  }
  function pageHead(depth, crumbItems, title, lead, eyebrow) {
    return '<div class="container page-head">' + breadcrumbHtml(depth, crumbItems) +
      (eyebrow ? '<span class="eyebrow">' + esc(eyebrow) + '</span>' : '') +
      '<h1>' + esc(title) + '</h1>' +
      (lead ? '<p class="lead">' + esc(lead) + '</p>' : '') + '</div>';
  }

  return {
    T: T, shell: shell, orgSchema: orgSchema, crumbs: crumbs, faqSchema: faqSchema,
    breadcrumbHtml: breadcrumbHtml, ctaBand: ctaBand, faqBlock: faqBlock,
    checkList: checkList, pageHead: pageHead, nav: nav, footer: footer, NAV: NAV
  };
});
