# Portfolio

A recruiter-focused personal portfolio for a backend / full stack software engineer.
**All content lives in JSON files in [`src/data`](src/data)**. You can update the whole site without touching React code.

Built with React 19, TypeScript, Vite, Tailwind CSS 4, Motion and Lucide icons. Every page is prerendered at build time, so it loads fast and crawlers see real content.

> **Before you publish:** every value in `src/data` is placeholder content. Identity fields are obvious ("Your Name", `you@example.com`, `your-username`). Experience, projects and metrics are marked "Example". Replace all of it with your own information, and replace `public/resume/resume.pdf` with your resume.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173 with hot reload (JSON edits appear instantly)
```

| Command             | What it does                                                         |
| ------------------- | -------------------------------------------------------------------- |
| `npm run dev`       | Local development server                                             |
| `npm run build`     | Type-check, production build and prerender into `dist/`               |
| `npm run preview`   | Serve the production build locally (http://localhost:4173)           |
| `npm test`          | Unit, rendering and **content validation** tests                      |
| `npm run typecheck` | TypeScript check (also validates JSON against the schemas)            |
| `npm run lint`      | ESLint                                                               |

Requires **Node.js 20.19+**.

**After editing JSON, run `npm test && npm run build`.** The type-check catches fields with the wrong shape. The content tests catch duplicate ids, malformed dates, unsafe links, unknown icons and missing files in `public/`.

---

## Which file controls what

| Section / feature             | File                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| Page title, SEO, Open Graph, theme, resume path, contact form, section headings, footer tagline | [`site-config.json`](src/data/site-config.json) |
| Section order and navigation labels | [`navigation.json`](src/data/navigation.json)          |
| Hero, About, contact email, location, availability | [`profile.json`](src/data/profile.json)   |
| Professional experience       | [`experience.json`](src/data/experience.json)                 |
| Featured projects             | [`projects.json`](src/data/projects.json)                     |
| Technical skills              | [`skills.json`](src/data/skills.json)                         |
| Achievements and impact metrics | [`achievements.json`](src/data/achievements.json)           |
| Education                     | [`education.json`](src/data/education.json)                   |
| Certifications                | [`certifications.json`](src/data/certifications.json)         |
| GitHub, LinkedIn, email and other links | [`social-links.json`](src/data/social-links.json)   |

The full schema, with comments for every field, is in [`src/types/content.ts`](src/types/content.ts). Fields marked `?` are optional: leave them out and the UI hides them.

### General rules

- **Order in JSON = order on the page.** Reorder array items to reorder cards, jobs or skills.
- **Dates** use `"YYYY-MM"` (e.g. `"2023-04"`). Use `"endDate": null` for a current role.
- **ids** must be unique within a file. Project ids appear in shareable URLs, so use lowercase words joined by hyphens (`"payment-gateway"`).
- **Empty sections disappear automatically**, along with their navigation link. For example, `"certifications": []` plus an empty `education.json` hides the Education section.
- Links must start with `https://`, `http://`, `mailto:`, `tel:` or `/`. Anything else, such as `javascript:`, is ignored for security.

---

## Common tasks

### Add a new project

Append an object to [`projects.json`](src/data/projects.json). A new card and its detail view appear automatically, and new categories become filter buttons.

```json
{
  "id": "payment-gateway",
  "title": "Payment Gateway Integration",
  "summary": "One or two sentences recruiters read on the card.",
  "categories": ["Backend", "FinTech"],
  "featured": false,
  "year": "2025",
  "role": "Backend engineer",
  "context": "Built at Company Name",
  "confidential": true,
  "problem": "What was broken or missing, and why it mattered.",
  "solution": "What you built and the key design decisions.",
  "architecture": {
    "overview": "How the pieces fit together.",
    "components": [
      { "name": "API", "description": "Validates requests and creates payments." },
      { "name": "Queue", "description": "Decouples provider calls from the request path." },
      { "name": "PostgreSQL", "description": "Stores payment state with idempotency keys." }
    ]
  },
  "contributions": ["What you personally did."],
  "technologies": ["Node.js", "TypeScript", "PostgreSQL"],
  "results": [{ "value": "40%", "label": "fewer failed payments" }],
  "links": { "github": "https://github.com/you/repo", "live": "https://demo.example.com" }
}
```

- `featured: true` gives the project the large layout at the top.
- With no `image`, the card draws an **architecture diagram from `architecture.components`** (first 5, in flow order).
- To use a screenshot instead, put it in `public/images/projects/` and add `"image": { "src": "/images/projects/payment-gateway.webp", "alt": "Dashboard showing payment status", "width": 1200, "height": 675 }`. WebP at 1200×675 works best.
- `confidential: true` with no links shows "Proprietary — source not public".
- Every project can be linked to directly: `https://your-domain.com/?project=payment-gateway`.

### Update professional experience

Edit [`experience.json`](src/data/experience.json). Put your most recent role first.

- `achievements`: shown prominently. Lead with outcomes and numbers.
- `impact`: small metric chips, e.g. `{ "value": "65%", "label": "faster settlement runs" }`.
- `responsibilities`: shown in a collapsible list. Keep it short.
- `technologies`: tags at the bottom of the card.
- Durations ("1 yr 9 mos") are calculated from the dates.

### Add or change skills

Edit [`skills.json`](src/data/skills.json). Each category has a `name`, an optional `icon` and a `skills` list. A skill can be a plain string or `{ "name": "Node.js", "core": true }`. Core skills are highlighted; use that for what you use daily. There are deliberately no percentage bars.

Available icon names (also used by `achievements.json`): `activity`, `bot`, `boxes`, `braces`, `chart`, `cloud`, `code`, `container`, `cpu`, `database`, `gauge`, `git-branch`, `globe`, `layers`, `layout`, `lock`, `network`, `rocket`, `server`, `shield`, `sparkles`, `terminal`, `test`, `timer`, `trending-up`, `trophy`, `workflow`, `wrench`, `zap`. To add more, register a [Lucide](https://lucide.dev/icons) icon in [`src/lib/icons.tsx`](src/lib/icons.tsx).

### Achievements and hero metrics

Each entry in [`achievements.json`](src/data/achievements.json) becomes a metric card. Set `"highlight": true` (up to 4) to also show it in the "Selected impact" strip in the hero. **Only include numbers you can defend in an interview.**

### Change social links

Edit [`social-links.json`](src/data/social-links.json). `platform` picks the icon: `github`, `linkedin`, `x`, `email`, `website` (anything else gets a generic link icon). `showInHero: true` shows the icon in the hero. All links appear in the footer and Contact section, and http(s) links are also listed in the search-engine structured data.

### Replace your resume

Replace `public/resume/resume.pdf` with your PDF, keeping the same name. To use a different file name or download name, update `resume` in `site-config.json`:

```json
"resume": { "path": "/resume/Jane-Doe-Resume.pdf", "downloadName": "Jane-Doe-Resume.pdf", "label": "Resume" }
```

Remove `resume` (or set `"path": ""`) to hide every resume button.

### Update your profile image

Put an image (square, at least 192×192, WebP or JPG) in `public/images/` and add this to `profile.json`:

```json
"avatar": { "src": "/images/avatar.webp", "alt": "Portrait of Jane Doe", "width": 192, "height": 192 }
```

Without an avatar, your initials are shown (set `initials`, or they're derived from `name`). The favicon is always generated from your initials.

### Years of experience and availability

In `profile.json`, set `"experience": { "careerStartDate": "2021-07" }` and the "5+ years" label stays current on its own. Or set `"years": 5` to fix the value. `status.label` is the availability pill in the hero; `"available": false` shows a grey dot instead of green. Delete `status` to hide it.

### Contact form

- By default the form validates input, then opens the visitor's email app with the message prefilled (`mailto:` to `profile.email`). The form says this explicitly, and nothing is stored on the site.
- To receive messages directly, create a free form at a service such as [Formspree](https://formspree.io) and set `"contact": { "formEndpoint": "https://formspree.io/f/xxxxxxx" }` in `site-config.json`. The form then POSTs JSON (`name`, `email`, `subject`, `message`) to it; only `https://` endpoints are used.
- `subjectPrefix` (e.g. `[Portfolio]`) is added to email subjects so you can filter enquiries.

### Sections and navigation

[`navigation.json`](src/data/navigation.json) controls both **which sections render and in what order**. Valid ids: `home`, `about`, `experience`, `skills`, `projects`, `achievements`, `education`, `contact`. Remove an id to remove the section. Add `"showInNav": false` to keep a section on the page without a header link. Section headings and descriptions are set under `sections` in `site-config.json`.

### SEO and social sharing

Set these in `site-config.json`. They are injected into the HTML at build time by [`build/seo-plugin.ts`](build/seo-plugin.ts):

- `siteUrl`: your deployed URL, e.g. `https://janedoe.dev`. Required for the canonical URL, `og:url`, `sitemap.xml` and `robots.txt`; the build warns if it's invalid.
- `title`, `description`, `keywords`: search-result title and snippet.
- `ogImage`: a 1200×630 PNG/JPG in `public/images/` (e.g. `{ "src": "/images/og-image.png", "alt": "..." }`) for LinkedIn, Slack and X previews. Leave `src` empty until you have one.
- `locale`: sets `<html lang>`, the Open Graph locale and the date format (`en-US`, `en-GB`, `en-IN`, …).
- `defaultTheme`: `"system"`, `"light"` or `"dark"`. A visitor's own choice is remembered.

JSON-LD `Person` structured data, `sitemap.xml`, `robots.txt` and `favicon.svg` are generated automatically.

---

## Deployment

`npm run build` produces a fully static `dist/` folder. Host it anywhere:

- **Vercel / Netlify / Cloudflare Pages**: build command `npm run build`, output directory `dist`, Node 20.19+.
- **GitHub Pages / S3 / Nginx**: upload the contents of `dist/`. The site is one page, so no rewrite rules are needed.

After deploying, set `siteUrl` to the real domain and rebuild, so canonical and sitemap URLs are correct.

Recommended response headers on your host: `Content-Security-Policy` (note that `index.html` contains two small inline scripts, the theme initialiser and JSON-LD, which need `'unsafe-inline'` or their hashes), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and long-lived caching for `/assets/*` and `/fonts/*`.

---

## Project structure

```
build/seo-plugin.ts        Generates meta tags, JSON-LD, favicon, sitemap and robots.txt from JSON
scripts/prerender.mjs      Injects server-rendered HTML into dist/index.html at build time
public/
  fonts/                   Self-hosted Geist & Geist Mono (OFL licence)
  images/                  Avatar, project images, social share image
  resume/resume.pdf        Your resume
src/
  data/*.json              ← all editable content
  types/content.ts         Schemas for every JSON file
  content/                 Loads JSON (index.ts) and derives display values with fallbacks (selectors.ts)
  sections/                Page sections; registry.tsx maps navigation ids to sections
  layouts/                 Header, footer, back-to-top
  components/              Shared UI (buttons, tags, cards, dialog, section shell, …)
  hooks/                   Theme, active section, scroll, deep-link state
  lib/                     Pure helpers: dates, URL safety, contact form, project filters, icons
  styles/                  Design tokens (colors, type scale, radii, shadows) and fonts
```

### Design system

Colors are semantic tokens (`bg`, `surface`, `fg`, `fg-muted`, `accent`, …) defined for light and dark themes in [`src/styles/index.css`](src/styles/index.css). Change `--accent` there to re-brand the whole site. Buttons and cards share class builders in [`src/components/ui/styles.ts`](src/components/ui/styles.ts).

### Adding a brand-new section type

1. Create the component in `src/sections/`.
2. Register it in [`src/sections/registry.tsx`](src/sections/registry.tsx) with a `hasContent` rule.
3. Add its id to `navigation.json`.

### Accessibility and motion

Semantic landmarks, a skip link, keyboard-operable menus and dialogs (native `<dialog>`), visible focus rings, `aria-pressed` filters and labelled icon buttons. Animations are subtle and are removed for visitors who enable "reduce motion".
