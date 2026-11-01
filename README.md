# ELLIS / LAB — personal AI systems research blog

A Next.js 16 / React 19 / TypeScript / MDX starter with a procedural cinematic flow hero and an interactive agent trace experiment.

## Quick start

```bash
npm install
npm run dev
```

Visit http://localhost:3000. pnpm works too: `pnpm install && pnpm dev`.

## Scripts

| Command             | What it does                               |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Next.js dev server                         |
| `npm run build`     | Production build                           |
| `npm run start`     | Serve the production build                 |
| `npm run lint`      | ESLint (Next core-web-vitals + TypeScript) |
| `npm run format`    | Format with Prettier                       |
| `npm run typecheck` | `tsc --noEmit`                             |
| `npm run check`     | typecheck + lint + Prettier check          |

## Routes

- `/` — cinematic hero and research landing page
- `/research` — research themes
- `/writing` — writing index
- `/writing/agent-runtime` — example MDX article
- `/experiments` — interactive (illustrative) trace explorer
- `/projects` — clearly marked project concepts

## Customize first

1. Update name, description, and metadata in `src/app/layout.tsx`.
2. Replace the example copy and research entries in `src/lib/content.ts` with your real writing.
3. Update the GitHub link in `src/components/site-header.tsx` (currently points to github.com, not a personal profile).
4. Edit color and type tokens in `src/styles/_tokens.scss`, layout styles in `src/styles/globals.scss`.
5. Edit cinematic background in `src/components/flow-canvas.tsx`.
6. Write new articles as `src/content/writing/<slug>/{en,zh}.mdx`, add a route under `src/app/[locale]/writing/<slug>/page.tsx`, and add it to the listing.

## Internationalization

English (`/`) and Chinese (`/zh`) are handled by [next-intl](https://next-intl.dev). UI copy lives in `messages/en.json` and `messages/zh.json`; English is the source locale. The globe button in the header switches language and keeps the current path.

`npm run i18n:lint` runs [eloqnt](https://cli.eloqnt.dev/docs) to catch missing keys, unused keys, and mismatched ICU arguments between locales. `npx eloqnt translate` can fill gaps, but it sends strings to eloqnt's hosted engine and needs a login.

## Visual + performance notes

The hero is original procedural artwork created with a 2D canvas and a hand-shaped flow field; it is **not** the Memori background or an exact recreation. It avoids video downloads and heavyweight WebGL dependencies. Canvas DPR is capped; animation is reduced for `prefers-reduced-motion`; rendering is paused outside the viewport. A future WebGL shader version can be introduced once the art direction is approved.

This starter uses locally available system fonts for zero font-network dependency. For production, add your chosen licensed fonts and optimize images. Add a domain and OG image, content taxonomy, RSS, sitemap, analytics, and automated accessibility audits before launch.

## Deployment

Deploy on any Node-compatible host using `pnpm build && pnpm start`. No API keys needed.
