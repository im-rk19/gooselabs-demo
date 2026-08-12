# GooseLabs website

A static marketing site with a browser-based CMS and a built-in SEO analyser. No build step, no
framework, no database — open `index.html` and it works.

Built for the Digital Marketing live project, IIM Raipur, August 2026.

---

## Run it

Clone or download, then open `index.html`. That is the whole setup.

## The editor

Open `admin.html`.


Edit any page through forms, watch the SEO analysis update as you type, then save. Running locally
from a folder, saving rewrites the HTML files in place. Running from a web address, saving hands
back a `.zip` — a browser cannot write files to a server.

> **The sign-in is a deterrent, not access control.** It runs entirely in the browser. Before this
> becomes a production site, use the host's own password protection, or remove `admin.html`,
> `content.js`, `render.js`, `pages.js`, `templates.js`, `seo.js` and `zip.js` from the deployment.

---

## How it is put together

| File | Role |
|---|---|
| `content.js` | Every word on the site, as one data file. The editor reads and rewrites it. |
| `templates.js` | Helpers: markdown renderer, icon set, escaping |
| `pages.js` | Page shell — head, metadata, schema, navigation, footer |
| `render.js` | Builds each page type from the content |
| `seo.js` | SEO and readability analysis. Editor only; never served to visitors. |
| `zip.js` | Minimal ZIP writer, so the editor can hand back a download offline |
| `site.js` | The only script visitors load: menu, theme, quiz, contact form |
| `styles.css` | Design system, including dark mode |

Add a markdown-style entry to `content.js` and a new page appears, joins the navigation and enters
`sitemap.xml` on the next save. Nothing is hard-coded per page.

## What is on the site

23 content pages — 6 services, 6 industries, 3 case studies, 8 articles — plus home, about, contact
and a real 404. Every page carries its own title, meta description, canonical link, Open Graph and
Twitter cards, and JSON-LD structured data.

## The SEO analyser

Implements the checks Yoast SEO Premium performs, in plain JavaScript:

- 15 SEO checks — keyphrase placement in title, description, slug, opening paragraph and
  subheadings; density; distribution; keyphrase length; duplicate keyphrase across pages; title
  width in pixels; description length; word count; internal, outbound and anchor links; image alt
- 7 readability checks — Flesch Reading Ease, sentence length, paragraph length, subheading
  distribution, passive voice, transition words, repeated sentence openings
- Live Google previews for desktop and mobile, measured in pixels
- Social previews with per-page overrides
- Prominent-word analysis and internal linking suggestions
- Redirect manager that writes `_redirects` and `vercel.json`

Thresholds follow Yoast's published values, the Plain English Campaign's sentence guidance and the
original Flesch formula. Two scoring models are shown: a percentage, and Yoast's own penalty-point
model scaled to the number of checks.

## Deploying

Any static host. Netlify Drop, Vercel, GitHub Pages and Cloudflare Pages all serve it as-is.
`_redirects` covers Netlify, `vercel.json` covers Vercel.

## Mobile

Tested at 320, 360, 390 and 768 pixels on every page type. No horizontal scrolling, no clipped
content, all interactive controls at least 40px.

---

## Credits

Articles by Anindita Mondal. Site, editor and SEO analyser built for GooseLabs (Raipur) as part of
the IIM Raipur Digital Marketing live project.
