/* ==========================================================================
   Gooselabs — the only JavaScript the live website uses.
   Mobile menu, the finder quiz, and the contact form. Nothing else.
   ========================================================================== */
(function () {
  'use strict';


  /* ---------- light / dark mode ---------- */
  (function () {
    var btns = [document.getElementById('themeToggle'), document.getElementById('themeToggleM')].filter(Boolean);
    if (!btns.length) return;
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var now = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', now);
        try { localStorage.setItem('gl-theme', now); } catch (e) {}
        btns.forEach(function (b) {
          b.setAttribute('aria-label', now === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        });
      });
    });
    // follow the operating system if the visitor has never chosen
    try {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', function (e) {
        if (!localStorage.getItem('gl-theme')) {
          document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
      });
    } catch (e) {}
  })();

  /* ---------- mobile menu ---------- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.hasAttribute('hidden');
      if (open) { menu.removeAttribute('hidden'); } else { menu.setAttribute('hidden', ''); }
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- contact form ---------- */
  var form = document.getElementById('leadForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      var endpoint = form.getAttribute('action');
      if (!endpoint) {
        // No endpoint configured yet - fall back to opening the visitor's email client
        // so an enquiry is never silently lost.
        e.preventDefault();
        var d = new FormData(form), lines = [];
        d.forEach(function (v, k) { if (v) lines.push(k + ': ' + v); });
        window.location.href = 'mailto:palashkanwar@gooselabs.in'
          + '?subject=' + encodeURIComponent('Website enquiry from ' + (d.get('name') || 'the website'))
          + '&body=' + encodeURIComponent(lines.join('\n'));
        say('Opening your email app. If nothing happens, write to palashkanwar@gooselabs.in directly.', 'ok');
      }
    });
  }
  function say(msg, kind) {
    var box = document.getElementById('formStatus');
    if (box) { box.className = 'form-status ' + (kind || 'ok'); box.textContent = msg; }
  }

  /* ---------- the finder quiz ---------- */
  var body = document.getElementById('fBody');
  if (!body) return;

  var STEPS = [
    { key: 'industry', q: 'Which industry is closest to yours?', options: [
      ['Healthcare', 'Healthcare', 'Clinics, hospitals, diagnostics, wellness'],
      ['Hospitality', 'Hotels & F&B', 'Hotels, resorts, restaurants, guest ops'],
      ['Manufacturing', 'Manufacturing', 'Factories, plants, production teams'],
      ['Community', 'Community & Events', 'Members, chapters, events, check-ins'],
      ['Creators', 'Creators & Agencies', 'Influencers, agencies, content teams'],
      ['SME', 'General business', 'SMEs, family businesses, operations'] ] },
    { key: 'pain', q: 'What is actually costing you time right now?', options: [
      ['Scattered data', 'Scattered data', 'Sheets, chats and files everywhere'],
      ['Manual follow-ups', 'Manual follow-ups', 'Things get forgotten or chased by hand'],
      ['No visibility', 'No visibility', 'You find out what happened far too late'],
      ['Too much WhatsApp', 'Too much WhatsApp', 'Important information gets buried'],
      ['Weak experience', 'Weak experience', 'Customer or patient journeys feel messy'],
      ['Need a product', 'Need a product', 'You want to build an app or platform'] ] },
    { key: 'timing', q: 'How soon would you want to start?', options: [
      ['Now', 'Straight away', 'Budget approved, ready to scope'],
      ['This quarter', 'This quarter', 'Planning it in the next few months'],
      ['Exploring', 'Just exploring', 'Understanding what is possible first'],
      ['Unsure', 'Not sure yet', 'Depends what the options look like'] ] }
  ];

  var REC = {
    Healthcare: ['Start with clinical documentation and the patient record',
      'Healthcare organisations almost always get the fastest return from removing documentation load and unifying the patient journey.',
      'services/healthcare-ai-systems.html', [
      ['Digital patient journey', 'Intake, diagnostics, consultation, programme and follow-up in one record.'],
      ['AI clinical documentation', 'Structured, EMR-ready notes produced during the consultation, not after it.'],
      ['Outcome tracking', 'See whether treatment programmes are actually working, across a cohort.']]],
    Hospitality: ['Start with a unified guest inbox',
      'Hotels and F&B businesses usually need one view across guest messages, bookings, reviews and revenue channels before anything else pays off.',
      'industries/hospitality.html', [
      ['Unified guest inbox', 'WhatsApp, OTAs, email, Google and social in one workflow with booking context.'],
      ['Owner dashboard', 'Occupancy, channel mix, review sentiment and open issues, delivered daily.'],
      ['Automated follow-ups', 'Review requests and feedback that happen without anyone remembering.']]],
    Manufacturing: ['Start with a bounded computer vision pilot',
      'Factories need to see what is happening on the floor now, not what was reported at shift end.',
      'industries/manufacturing.html', [
      ['Vision pilot on one area', 'Movement, idle time, queueing and safety compliance, measured continuously.'],
      ['Area and flow mapping', 'Where material and people actually bottleneck.'],
      ['Efficiency dashboard', 'Turn continuous observation into numbers leadership can act on.']]],
    Community: ['Start with events, RSVPs and check-ins',
      'Membership organisations run on volunteer time, and that time disappears into RSVP counting and attendance sheets.',
      'work/whatson-yi-raipur.html', [
      ['Events and RSVPs', 'Confirmed numbers before catering is ordered.'],
      ['QR check-in', 'A second at the door, attendance data as a by-product.'],
      ['Engagement analytics', 'Evidence of which activities members actually value.']]],
    Creators: ['Start with brand CRM and the deliverable calendar',
      'For creator teams the leak is operational - deals in DMs, deliverables in someone’s head.',
      'industries/creators.html', [
      ['Brand and agency CRM', 'Every conversation from first contact to payment in one place.'],
      ['Deliverable calendar', 'Shoots, publishing, travel and deadlines in one view.'],
      ['Performance view', 'Connected platform data instead of screenshots.']]],
    SME: ['Start with an AI use case sprint',
      'Two weeks to find where AI genuinely helps your operation - and to rule out the ideas that would waste your money.',
      'services/ai-use-case-sprint.html', [
      ['Workflow mapping', 'How information really moves, not how the process document says it does.'],
      ['Opportunity scoring', 'Every candidate ranked on business value and feasibility.'],
      ['Costed roadmap', 'Yours to act on, with us or without us.']]]
  };
  var PAIN = {
    'Too much WhatsApp': ['Start with a WhatsApp-first assistant',
      'If most of your business already happens on WhatsApp, the system should meet people where they are rather than asking them to move.',
      'services/ai-automation.html', [
      ['WhatsApp report agent', 'Send a document, get a clean structured summary back.'],
      ['Reminder agent', 'Automated follow-ups to staff, vendors, patients or customers.'],
      ['Escalation routing', 'The right update reaches the right person instead of a group of forty.']]],
    'Need a product': ['Start with a focused MVP',
      'The first goal is not to build everything. It is to build the smallest version people will genuinely use.',
      'services/product-mvp-builds.html', [
      ['Product definition', 'Users, screens, data model and business logic, agreed before code.'],
      ['MVP build', 'Mobile app, web platform, admin panel or internal tool.'],
      ['Launch and iterate', 'Instrumented from day one so version two is decided by data.']]]
  };

  var state = {}, step = 0, phase = 'quiz';
  var prefix = document.body.getAttribute('data-root') || '';

  function progress() {
    var pct = phase === 'result' ? 100 : ((phase === 'capture' ? 3 : step) / 3) * 100;
    document.getElementById('fProgress').style.width = pct + '%';
    document.getElementById('fStep').textContent =
      phase === 'result' ? 'Your recommendation' : phase === 'capture' ? 'Last step' : 'Step ' + (step + 1) + ' of 3';
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }

  function drawQuiz() {
    var s = STEPS[step];
    body.innerHTML = '<h3>' + s.q + '</h3><div class="option-grid">' +
      s.options.map(function (o) {
        return '<button type="button" class="option" data-v="' + esc(o[0]) + '"><strong>' + esc(o[1]) + '</strong><small>' + esc(o[2]) + '</small></button>';
      }).join('') + '</div>' +
      (step > 0 ? '<button type="button" class="btn btn-ghost btn-sm" id="fBack" style="margin-top:18px">&larr; Back</button>' : '');
    Array.prototype.forEach.call(body.querySelectorAll('.option'), function (b) {
      b.addEventListener('click', function () {
        state[s.key] = b.getAttribute('data-v');
        if (step < 2) { step++; } else { phase = 'capture'; }
        draw();
      });
    });
    var back = document.getElementById('fBack');
    if (back) back.addEventListener('click', function () { step--; draw(); });
  }

  function drawCapture() {
    body.innerHTML =
      '<h3>Where should we send it?</h3>' +
      '<p class="muted small" style="margin-bottom:18px">We will show your recommendation right away and follow up on WhatsApp only if you want us to.</p>' +
      '<form id="fForm">' +
      '<label class="field"><span>Your name</span><input name="name" required></label>' +
      '<label class="field"><span>WhatsApp number</span><input name="whatsapp" type="tel" placeholder="+91" required></label>' +
      '<label class="field"><span>Company <span class="muted">(optional)</span></span><input name="company"></label>' +
      '<div class="btn-row" style="margin-top:0">' +
      '<button type="submit" class="btn btn-primary">Show my recommendation</button>' +
      '<button type="button" class="btn btn-ghost" id="fBack2">&larr; Back</button></div>' +
      '<p class="muted small" style="margin-top:12px">Captured so far: ' + esc(state.industry) + ' &middot; ' + esc(state.pain) + ' &middot; ' + esc(state.timing) + '</p>' +
      '</form>';
    document.getElementById('fBack2').addEventListener('click', function () { phase = 'quiz'; step = 2; draw(); });
    document.getElementById('fForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(e.target);
      state.name = f.get('name'); state.whatsapp = f.get('whatsapp'); state.company = f.get('company');
      sendLead(state);
      phase = 'result'; draw();
    });
  }

  function drawResult() {
    var r = PAIN[state.pain] || REC[state.industry] || REC.SME;
    body.innerHTML =
      '<div class="eyebrow" style="margin-bottom:14px">Recommended starting point</div>' +
      '<h3>' + esc(r[0]) + '</h3>' +
      '<p class="muted" style="margin-bottom:18px">' + esc(r[1]) + '</p>' +
      r[3].map(function (i) {
        return '<div class="result-item"><strong>' + esc(i[0]) + '</strong><span>' + esc(i[1]) + '</span></div>';
      }).join('') +
      '<div class="btn-row"><a href="' + prefix + r[2] + '" class="btn btn-primary">Read more &rarr;</a>' +
      '<button type="button" class="btn btn-ghost" id="fReset">Start again</button></div>' +
      '<p class="muted small" style="margin-top:12px">Thanks ' + esc(state.name || '') + ' &mdash; we will be in touch on WhatsApp shortly.</p>';
    document.getElementById('fReset').addEventListener('click', function () {
      state = {}; step = 0; phase = 'quiz'; draw();
    });
  }

  /* Where finder leads go.
     Set window.LEAD_ENDPOINT in content.js (or leave it empty) - if it is empty the
     lead is stored in the browser and also emailed via the visitor's mail app on request. */
  function sendLead(data) {
    var endpoint = window.LEAD_ENDPOINT || '';
    var payload = JSON.stringify({ source: 'finder', receivedAt: new Date().toISOString(), data: data });
    try { localStorage.setItem('gooselabs_lead_' + Date.now(), payload); } catch (e) {}
    if (endpoint) {
      try {
        fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload });
      } catch (e) {}
    }
  }

  function draw() {
    progress();
    if (phase === 'quiz') drawQuiz();
    else if (phase === 'capture') drawCapture();
    else drawResult();
  }
  draw();
})();
