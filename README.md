# ELLIS / LAB

A bilingual (English / Chinese) personal blog about AI systems research: agent runtimes, decision reliability, and distributed execution.

Built with Next.js 16, React 19, TypeScript, MDX, Sass, and next-intl.

## Quick start

```bash
npm install
npm run dev
```

Visit http://localhost:3000 (English) or http://localhost:3000/zh (Chinese). Requires Node.js 20.9 or later; `.nvmrc` pins the version used in CI.

## Scripts

| Command                | What it does                                                 |
| ---------------------- | ------------------------------------------------------------ |
| `npm run dev`          | Next.js dev server                                           |
| `npm run build`        | Production build                                             |
| `npm run start`        | Serve the production build                                   |
| `npm run lint`         | ESLint (Next core-web-vitals + TypeScript)                   |
| `npm run lint:fix`     | ESLint with auto-fix                                         |
| `npm run format`       | Format with Prettier                                         |
| `npm run format:check` | Check formatting without writing                             |
| `npm run typecheck`    | `tsc --noEmit`                                               |
| `npm run i18n:lint`    | Check translation files with eloqnt                          |
| `npm run check`        | typecheck + lint + i18n:lint + format:check (also run in CI) |
| `npm run icons`        | Regenerate `favicon.ico` and `apple-icon.png` from SVG       |

## Routes

Every route exists in both languages. English has no prefix; Chinese is under `/zh`.

- `/` — hero and research landing page
- `/research` — research themes
- `/writing` — writing index
- `/writing/agent-runtime` — example MDX article
- `/experiments` — interactive (illustrative) trace explorer
- `/projects` — project concepts

## Where things live

| To change                                       | Edit                                                      |
| ----------------------------------------------- | --------------------------------------------------------- |
| Site title, description, all page copy          | `messages/en.json`, `messages/zh.json`                    |
| Research and project entries (ids, links, tags) | `src/lib/content.ts` (their text is in `messages/*.json`) |
| Colors, fonts, spacing                          | `src/styles/_tokens.scss`                                 |
| Layout and component styles                     | `src/styles/globals.scss`                                 |
| Hero animation                                  | `src/components/flow-canvas.tsx`                          |
| Header logo and links                           | `src/components/site-header.tsx`                          |
| Site icons                                      | `src/app/icon.svg`, `scripts/icons/apple-icon.svg`        |

## Writing an article

1. Add the body in both languages: `src/content/writing/<slug>/en.mdx` and `zh.mdx`.
2. Add a route at `src/app/[locale]/writing/<slug>/page.tsx` (copy `agent-runtime/page.tsx`).
3. Add the article's title, lede, and metadata under `article` in `messages/*.json`, and list it on `src/app/[locale]/writing/page.tsx`.

Internal links in MDX (`[text](/experiments)`) keep the reader's current language automatically.

### Code blocks

Code is highlighted at build time with [Shiki](https://shiki.style) through `rehype-pretty-code`, so it adds no client JavaScript. Each block gets a copy button.

````md
```ts title="runtime/authorize.ts" {6-8} showLineNumbers
// ...
```
````

- `title="..."` shows a filename above the block
- `{6-8}` highlights lines 6–8
- `showLineNumbers` adds line numbers

The theme is set in `next.config.mjs`. Turbopack needs MDX plugins named as strings with serializable options.

## Internationalization

Routing and copy are handled by [next-intl](https://next-intl.dev). English is the source locale. The globe button in the header switches language, keeps the current page and scroll position, and crossfades the content using React's `<ViewTransition>`. The chosen language is remembered in the `NEXT_LOCALE` cookie.

Locale routing runs in `src/proxy.ts` (Next.js 16 renamed `middleware.ts` to `proxy.ts`).

`npm run i18n:lint` runs [eloqnt](https://cli.eloqnt.dev/docs) to catch missing keys, unused keys, and mismatched ICU arguments between locales. `npx eloqnt translate` can fill missing translations, but it sends strings to eloqnt's hosted engine and needs a login.

## Icons

`src/app/icon.svg` is a simplified mark that stays legible at 16px. `scripts/icons/apple-icon.svg` is the full mark for the iOS home screen. After editing either, run `npm run icons` to regenerate `src/app/favicon.ico` (16/32/48) and `src/app/apple-icon.png` (180). Next.js adds the `<link>` tags automatically.

## Visual and performance notes

The hero is procedural artwork drawn on a 2D canvas, with no video or WebGL dependency. Canvas resolution is capped at 2× DPR, rendering pauses when the hero is off screen, and animation stops when the system "reduce motion" setting is on.

The site uses system fonts, so it makes no font network requests.

## Deployment

```bash
npm ci
npm run build
npm run start
```

Runs on any Node.js host, or deploy to Vercel. No API keys or environment variables are needed.

## Troubleshooting

**`Turbopack is not supported on this platform` on Apple Silicon.** macOS rejected the unsigned native SWC binary, so Next.js fell back to WASM. Re-sign it after installing dependencies:

```bash
codesign --force --sign - node_modules/@next/swc-darwin-arm64/next-swc.darwin-arm64.node
```

Or run the dev server with Webpack: `npx next dev --webpack`.
