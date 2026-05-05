# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Next.js dev server (localhost:3000)
npm run build    # Production build
npm run start    # Run production build
npm run lint     # Run ESLint
```

> Note: `package.json` references a Next.js + Tailwind + Radix UI stack, but the **deployed frontend is vanilla HTML/CSS/JS** (`index.html`, `style.css`, `script.js`). The Next.js scripts are available for a planned/future migration — do not assume Next.js conventions apply to the current code.

## Architecture

This is a **single-page portfolio/resume site** for a Cloud Engineer. It is entirely static (no build step required) and integrates with two AWS Lambda endpoints for live counters.

### File Roles

- [index.html](index.html) — All content; one HTML file with 9 semantic sections (nav, about, education, experience, projects, skills, click tracker, contact, footer)
- [style.css](style.css) — All styling; uses CSS custom properties for theming (light/dark)
- [script.js](script.js) — All interactivity; no frameworks, no bundler

### Key Patterns in script.js

**Theme system** — Theme is applied via a `<script>` tag *before* the DOM renders (prevents white flash). It reads `localStorage` and sets `document.documentElement.dataset.theme`.

**View counter** — On page load, POSTs to the `/views` Lambda endpoint. Result is cached in `localStorage` to avoid re-fetching.

**Click counter** — Two-layer system:
- Local session counter (optimistic UI, updates immediately)
- Lock/unlock toggle for persistent count (stored in `localStorage`)
- Backend POST to `/clicks` endpoint is fire-and-forget with 300ms debounce

**AWS API Gateway base URL:**
```
https://fjwy1ub4ge.execute-api.us-east-1.amazonaws.com
```
Endpoints: `/views` (POST), `/clicks` (POST)

**Project carousel** — Horizontal scroll with `scroll-snap-type`. Arrow key and button navigation. Touch/swipe not natively supported — uses scroll container.

**Timeline animations** — `IntersectionObserver` triggers CSS class on `.timeline-item` elements as they scroll into view.

**Active nav link** — Recalculated on every `scroll` event by comparing `window.scrollY` against each section's `offsetTop`.

### CSS Theme System

Two themes defined via CSS variables on `:root` (light) and `[data-theme="dark"]`. The `data-theme` attribute lives on `<html>`. Breakpoints: 768px (mobile nav, single-column layout) and 480px (further spacing reduction).

### Static Assets

- [OsaGradPic.jpg](OsaGradPic.jpg) — Hero portrait
- [Osaretin-Cloud-Resume-0.pdf](Osaretin-Cloud-Resume-0.pdf) — Downloadable resume; update filename in `index.html` if replaced
