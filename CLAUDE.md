# CLAUDE.md — Personal Portfolio

## Purpose & audience
Personal portfolio supporting a career move into **data engineering**.
Personal details come from the owner or the resume (see **Resume and personal info**). Never invent personal info; anything still unknown stays a `TODO` placeholder.
Audience: **tech recruiters and hiring managers**. They skim, so every page must be fast to scan, keyword-rich (tools/tech), and load instantly.

## Design direction
- **Spirit of paulgraham.com, modernized**: text-first, narrow readable column, navigation as a plain list of links. Build original markup/CSS; do not copy PG's images, logo, or code.
- **Not ultra-minimal**: project pages may include screenshots, diagrams, and charts.
- **Navigation:** persistent **left sidebar** on every page (name at top, then About / Experience / Projects / Other). On narrow screens it collapses to a top row of links. Highlight the current section.
- **Typography:** retro, PG-style **Verdana** (`Verdana, Geneva, Tahoma, sans-serif`) at a small base size (14px). No web fonts. `Courier New` only for code/tags.
- **Layout is left-aligned** (not centered) and kept plain and old-web: no cards, rounded boxes, or shadows.
- **Color:** neutral black/white base + **one accent color** (links, headings, active nav). Light and dark variants, switched by `@media (prefers-color-scheme: dark)`. **No manual toggle.**
  - All colors live as CSS custom properties in `src/styles/global.css`: `--bg`, `--fg`, `--muted`, `--border`, `--accent`.
  - Accent is **forest green**: `#2d6a3e` (light) / `#7cc48b` (dark). Keep it a single-token change; if it changes, also update `public/favicon.svg` and run `node scripts/make-og.mjs`.
  - Text and accent must meet WCAG AA contrast in both modes.
- **Mobile-first**, no horizontal scroll, images `max-width: 100%`.
- **No client-side JavaScript** except the analytics snippet and the tiny click-to-copy script for the email on `/about` (owner asked for copy-to-clipboard instead of `mailto:`; it falls back to selecting the text).

## Pages / sections
| Route | Content |
|---|---|
| `/` | Name + 2–3 sentence intro, then one "Latest project: <title> →" link (newest non-draft project, automatic). No other link list (navigation lives in the sidebar) |
| `/about` | General bio, contact (email click-to-copy, LinkedIn, GitHub), "Resume (PDF)" link styled as a normal link but with no `href` yet (see Resume and personal info) |
| `/experience` | One plain-text entry per role: small inline logo + company (bold), title, dates, domain, "Tools: a, b, c". **No impact bullets**; those live in the resume. An "Education" section (Wheaton College) sits at the bottom |
| `/projects` | List, newest first: title, one-line summary, Courier tech tags, date (Mon YYYY) with plain-text "(in progress)" when applicable. No badges |
| `/projects/<slug>` | Description, visuals (screenshots, architecture diagrams, chart images), tags, GitHub link |
| `/other` | Certifications/coursework (with credential links). Interests live in one line on `/about` |

## Tech stack
- **Astro 7**, static output, TypeScript strict (`npm run build` runs `astro check` first)
- **Content collections** (Markdown + Zod schemas) for projects, experience, certifications
- `astro:assets` `<Image>` for raster images (screenshots, charts); SVG diagrams can be used directly
- **Plain CSS**: one global stylesheet + scoped component styles. No Tailwind, no UI framework, no React
- `@astrojs/sitemap` for `sitemap-index.xml`
- **Analytics:** cookie-free; GoatCounter by default (provider still open, see Open decisions). Single `<script>` in the base layout, prod builds only, and only rendered when `PUBLIC_GOATCOUNTER_CODE` is set (repo variable `GOATCOUNTER_CODE` in CI)
- **Hosting:** GitHub Pages via GitHub Actions (`withastro/action`), repo **github.com/raykim02/portfolio**

## Base path (important)
The repo is named `portfolio`, so until a custom domain exists the site is served at
`https://raykim02.github.io/portfolio/` and `astro.config.mjs` sets `base: '/portfolio'`.
- **Never hard-code internal links.** Always wrap them with `url()` from `src/lib/site.ts` (e.g. `href={url('/projects')}`), and use `astro:assets` for images so their paths are base-aware.
- When the custom domain goes live: set `site` to the domain, delete `base`, add `public/CNAME`. Nothing else should need to change.

## Directory structure
```
portfolio/
├─ CLAUDE.md
├─ astro.config.mjs              # `site`, `base`, sitemap integration
├─ package.json / tsconfig.json
├─ .env.example                  # PUBLIC_GOATCOUNTER_CODE
├─ .github/workflows/deploy.yml  # build + deploy to Pages on push to main
├─ scripts/make-og.mjs          # builds public/og-default.png from the --accent in global.css
├─ private/                      # gitignored; never commit (resume source: Raymond_Kim_Resume.pdf)
├─ public/
│  ├─ resume.pdf                 # not yet; see Resume and personal info
│  ├─ og-default.png             # 1200x630 text-only share preview; regenerate with `node scripts/make-og.mjs`
│  ├─ favicon.svg
│  └─ CNAME                      # add once custom domain is purchased
└─ src/
   ├─ content.config.ts          # collection schemas
   ├─ lib/site.ts                # SITE (name, intro, contact links), NAV, url(), monthYear()
   ├─ content/
   │  ├─ projects/<slug>/index.md    # images co-located in the same folder
   │  ├─ experience/<company>.md
   │  └─ certifications/<name>.md
   ├─ assets/logos/              # company logos
   ├─ layouts/BaseLayout.astro   # <head>, SEO/OG, sidebar, analytics
   ├─ components/
   │  ├─ Sidebar.astro
   │  ├─ Seo.astro
   │  └─ ProjectListItem.astro
   ├─ pages/
   │  ├─ index.astro
   │  ├─ about.astro
   │  ├─ experience.astro
   │  ├─ projects/index.astro
   │  ├─ projects/[slug].astro
   │  ├─ other.astro
   │  ├─ 404.astro               # custom not-found page (GitHub Pages serves dist/404.html)
   │  └─ robots.txt.ts           # generated robots.txt pointing at the sitemap
   └─ styles/global.css          # color tokens (light + dark), base typography, layout
```

## Content schemas (frontmatter)
**Project** (`src/content/projects/<slug>/index.md`)
```yaml
title: string
summary: string            # one line, shown in list + meta description
date: YYYY-MM-DD           # completion/last-update; list sorts by this desc
status: complete | in-progress
tags: [Python, Airflow, ...]
github: https://github.com/...
cover: ./cover.png         # optional; used for OG image too
coverAlt: string           # optional; alt text for cover
draft: false               # optional; drafts excluded from build
```
The project's URL slug is its folder name.
**Experience** (`src/content/experience/<company>.md`)
```yaml
company: string
logo: ../../assets/logos/<file>.svg   # optional; falls back to first letter
title: string
start: YYYY-MM
end: YYYY-MM               # omit = "Present"
tools: [Tool One, Tool Two, ...]
domain: string             # industry / general domain of work
```
**Certification** (`src/content/certifications/<name>.md`)
```yaml
name: string
issuer: string
date: YYYY-MM
url: https://...           # optional credential link
status: earned | in-progress   # optional
badge: ../../assets/badges/<file>.png   # optional; small image beside the cert
```

## Content rules
- **Never include confidential employer information**: no client names, internal system names, hostnames, schemas, data, or screenshots of work systems.
- Experience stays high-level (tools + domain). Impact bullets belong in the resume PDF, not the site.
- Write in a plain, direct, first-person voice (PG-like). Short paragraphs.
- **External links open in a new tab**: in `.astro` files add `target="_blank" rel="noopener noreferrer"`; in Markdown it's automatic (`src/lib/external-links.mjs`). Internal links and `mailto:` stay in the same tab.
- Quote YAML frontmatter values that contain a colon (`domain: 'Industry: detail'`), or the build fails.
- Every project page should answer: what problem, how it's built (diagram), what tools, what I learned, and link to GitHub.
- Alt text on every image.

## Resume and personal info
- My resume is at `private/Raymond_Kim_Resume.pdf` (gitignored). It is the source of truth for experience, project, and skills content, but it is **not the complete list**.
- The site's Experience section also includes a **Project Coordinator** role that is not on the resume (college part-time job, about a year; started before the Equinix internship and ended before First Trust). Its details come from me, not the resume. Never invent or guess them.
- The site's Projects section includes additional GitHub projects (github.com/raykim02) not on the resume, described from each repo's README. **National Defense Spending is featured first.** Confirmed so far: National Defense Spending only (more to be chosen by me).
- **Never publish my phone number** anywhere on the site.
- **No resume download, link target, or embedded resume for now.** The "Resume (PDF)" text on `/about` stays, styled as a normal link, but has no `href` until I upload `public/resume.pdf`.
- **Never commit anything inside `private/`.**
- **Certificate files** (PDFs, badge images) also live in `private/` and are never committed. The site lists certifications as **text** (title, issuer, date) linked to the **official verification URL** (Udemy, TryHackMe, dbt credentials, etc.). A cert with no verification URL is listed without a link. A badge image is only copied into `src/assets/badges/` with my approval (currently: dbt Fundamentals badge and TryHackMe logo supplied by me). Udemy certificates were dropped as not data-engineering relevant.
- When I update the resume, re-read it and update the site to match, without removing the Project Coordinator role or the extra GitHub projects.
- Keep internal system names off the site even if the resume mentions them (e.g. Equinix's internal platform name).

## Adding a project
1. Create `src/content/projects/<slug>/index.md` with the frontmatter above.
2. Put screenshots, exported diagrams (Excalidraw/draw.io → SVG/PNG), and chart images in the same folder; reference them relatively.
3. Use `status: in-progress` for unfinished work; `draft: true` to hide entirely.
4. `npm run build` to validate the schema, then push. Deploy runs automatically.

## SEO & sharing
- Every page: unique `<title>` and meta description (projects use `summary`).
- Open Graph + Twitter card tags; default image `public/og-default.png`, project `cover` overrides.
- Canonical URL from `site` in `astro.config.mjs`.
- Sitemap via `@astrojs/sitemap`; `robots.txt` pointing to it.

## Commands
```
npm install
npm run dev       # local dev server (http://localhost:4321/portfolio/)
npm run build     # astro check + static build to dist/ (also validates content schemas)
npm run preview   # serve the built site locally
```

## Deployment
- Push to `main` → GitHub Actions builds with `withastro/action` → deploys to GitHub Pages.
- Repo Settings → Pages → Source: **GitHub Actions** (one-time setup).
- Optional: repo Settings → Variables → `GOATCOUNTER_CODE` to enable analytics.
- Custom domain (to be purchased): add `public/CNAME` with the domain, set DNS (apex A/AAAA records to GitHub Pages IPs, `www` CNAME to `raykim02.github.io`), enable "Enforce HTTPS", then update `site` and remove `base` in `astro.config.mjs` (see Base path).

## Open decisions
- [ ] Analytics provider: GoatCounter (default) vs Cloudflare Web Analytics
- [ ] Domain name + registrar
- [ ] Which additional GitHub projects to feature after National Defense Spending, and in what order
- [ ] Keep or drop the cert badge/logo images on `/other`
- [ ] Upload `public/resume.pdf` (phone number removed) and give the About link its `href` (owner: by end of next week; no applications until then)
- [ ] Profile photo for the home page (replace `assets/profile-placeholder.svg`)
- [ ] "What I learned" section for the National Defense Spending project page (text from me)
