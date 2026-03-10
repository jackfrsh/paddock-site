# CLAUDE.md — Paddock Marketing Site

This file provides guidance for AI assistants working in this repository.

## Project Overview

This is the **Paddock marketing/landing site** — a static-prerendered React SPA that serves as the public-facing website for [Paddock](https://getpaddock.com), a personal net worth and wealth tracking app. It is not the app itself; the app lives at `app.getpaddock.com`.

**Stack**: React 19 + Vite 7 + plain CSS
**No TypeScript, no routing library, no state management, no test suite, no database.**

---

## Repository Structure

```
paddock-site/
├── public/                  # Static assets served as-is
│   ├── favicon.svg
│   ├── og-image.png         # OpenGraph image for social sharing
│   ├── robots.txt
│   └── sitemap.xml          # Updated manually when routes change
├── scripts/
│   └── prerender.js         # Post-build script: generates static HTML per route
├── src/
│   ├── assets/
│   │   └── landing/         # Product screenshot PNGs and WebPs
│   ├── components/
│   │   ├── GuideLayout.jsx  # Shared layout + semantic components for guide pages
│   │   └── SiteFooter.jsx   # Footer used across all pages
│   ├── guides/              # Long-form guide content pages
│   │   ├── GuideIndex.jsx
│   │   ├── MultiCurrency.jsx
│   │   ├── LongTermProjection.jsx
│   │   └── InflationAdjusted.jsx
│   ├── pages/               # Shorter marketing/info pages
│   │   ├── NetWorthTracker.jsx
│   │   ├── TrackISAsPensionsSavings.jsx
│   │   ├── SpreadsheetAlternative.jsx
│   │   ├── HowToTrackNetWorth.jsx
│   │   ├── Privacy.jsx
│   │   ├── Security.jsx
│   │   └── Terms.jsx
│   ├── App.jsx              # Entry point: routing, landing page, global hooks
│   ├── App.css              # All styling (1200+ lines, single file)
│   ├── index.css            # Global resets only
│   ├── main.jsx             # ReactDOM.createRoot entry
│   └── meta.js              # SEO metadata for every route
├── index.html               # HTML shell with base meta tags
├── vite.config.js
└── eslint.config.js
```

---

## Development Workflow

### Commands

```bash
npm run dev       # Start local dev server (Vite HMR)
npm run build     # Production build: vite build + prerender static HTML
npm run preview   # Preview the production build locally
npm run lint      # ESLint check
```

### Running Locally

```bash
npm install
npm run dev       # http://localhost:5173
```

No environment variables are required for local development.

---

## Routing

There is **no routing library**. Routing is implemented manually in `App.jsx` using:

- `window.location.pathname` to determine the active route on load
- `history.pushState()` via `navigateTo()` for client-side navigation
- A `getRoute()` function that maps URL strings to route identifiers
- A `popstate` listener for browser back/forward

### Adding a New Route

1. Add the URL → identifier mapping in `getRoute()` in `App.jsx`.
2. Add the render branch in the JSX conditional chain (`route === 'your-route' && <YourComponent />`).
3. Add metadata (title, description, canonical, OG, JSON-LD) to `src/meta.js`.
4. Add the route to `scripts/prerender.js` so a static HTML file is generated at build time.
5. Add the URL to `public/sitemap.xml`.

---

## Static Prerendering

After `vite build`, `scripts/prerender.js` runs automatically. It:

1. Reads `dist/index.html` (the Vite output shell).
2. For each route, injects SEO metadata from `src/meta.js` (title, description, canonical, OG tags, JSON-LD structured data).
3. Writes individual `index.html` files into `dist/<route>/index.html`.

This gives each page unique, crawlable metadata while still hydrating as a SPA client-side. The script escapes HTML in all injected values to prevent injection.

**When you change metadata in `src/meta.js`, it only takes effect after a full build** — not in `npm run dev`.

---

## Styling

- **Single CSS file**: all styles live in `src/App.css`. There are no CSS Modules, Tailwind, or styled-components.
- **CSS custom properties** are defined at `:root` and used throughout:
  - `--bg`, `--bg-card`, `--text`, `--text-muted` — colour tokens
  - `--accent` (`#4b79a8`) — primary blue
  - `--radius-*` — border radius scale
  - `--shadow-*` — shadow scale
- **Dark theme only** — no light mode toggle.
- **Responsive** with raw media query breakpoints: 1100px, 980px, 768px, 760px, 640px.
- Uses `clamp()` for fluid typography.
- Supports `prefers-reduced-motion`.

### CSS Naming Convention

- `.landing-shell`, `.guide-*`, `.section`, `.container` — layout
- `.btn`, `.btn-primary`, `.btn-secondary` — buttons
- All classes are **kebab-case**, scoped conceptually by prefix (e.g., `guide-*` for guide pages).

---

## Component Conventions

- **Functional components only** — no class components.
- **`.jsx` extension** for all React files.
- **No TypeScript** — plain JavaScript/JSX throughout.
- **Props drilling** — no Context API or external state management.
- **PascalCase** for component names and files (`SiteFooter.jsx`).
- **camelCase** for functions and variables (`navigateTo`, `useReveal`).

### Guide Pages

Guide pages use shared semantic components from `GuideLayout.jsx`:

```jsx
import { GuideShell, H2, P, UL, Callout, ProTip, Example, Divider, GuideCTA, GuideLink } from '../components/GuideLayout.jsx';
```

Always wrap guide pages in `<GuideShell>` and use these components for consistent structure and styling.

### Custom Hook

`useReveal()` (defined in `App.jsx`) — attaches an `IntersectionObserver` to scroll-animate elements with the class `.reveal`. Use it in any page/guide component that needs scroll-triggered animations:

```jsx
useReveal();
```

Then add `className="reveal"` to elements you want to animate in.

---

## SEO Metadata (`src/meta.js`)

Every route must have an entry in `meta.js`. Each entry contains:

```js
{
  title: "Page Title | Paddock",
  description: "Meta description (150-160 chars ideal)",
  canonical: "https://getpaddock.com/route-path",
  og: { title, description, image, url },
  jsonLd: { /* JSON-LD structured data object */ }
}
```

The prerender script reads this file at build time using `fs.readFileSync` + `vm.runInNewContext` — keep the file as a plain JS object export compatible with both ESM and CommonJS contexts.

---

## Images / Assets

- Product screenshots live in `src/assets/landing/` as **both `.png` and `.webp`**.
- Use `<picture>` elements with a `<source type="image/webp">` for the WebP variant and `<img>` for the PNG fallback.
- Add `loading="lazy"` to all below-the-fold images.
- The OpenGraph image is `public/og-image.png` — update it if the landing page design changes significantly.

---

## External Links

The site links out to:

- `https://app.getpaddock.com/auth?mode=signup` — Sign-up CTA
- `https://app.getpaddock.com/auth?mode=signin` — Sign-in link

These are referenced in `App.jsx` via the `goTo()` helper. Do not hardcode these URLs elsewhere — use `goTo()` for navigation to the app.

---

## Deployment

The site deploys to **Cloudflare** (static hosting). The build output in `dist/` is uploaded directly. There are no server-side components.

- Push to the correct branch to trigger a Cloudflare deploy.
- `public/sitemap.xml` and `public/robots.txt` are served as static files — update them when adding routes.

---

## Linting

ESLint 9 flat config is used. Key rules:

- `no-unused-vars` — allows uppercase and `_`-prefixed names (`^[A-Z_]` pattern).
- `react-hooks/rules-of-hooks` and `react-hooks/exhaustive-deps` are enforced.
- `react-refresh/only-export-components` warns (not errors) for non-component exports.

Run `npm run lint` before committing. There is no pre-commit hook enforcing this.

---

## Things That Don't Exist Here

To avoid confusion — the following are **not** present in this repo:

- TypeScript / `.ts` / `.tsx` files
- A test suite (no Jest, Vitest, Playwright, etc.)
- React Router or any routing library
- Tailwind CSS or CSS Modules
- A backend / API routes
- Environment variables (no `.env` needed)
- Authentication logic (auth lives in `app.getpaddock.com`)
- A database or ORM
- State management (Redux, Zustand, etc.)
- A monorepo setup (this is standalone)
