import createMDX from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  reactStrictMode: true,
  // Home-directory pnpm-lock.yaml makes Next treat ~ as the workspace root.
  turbopack: { root: dirname(fileURLToPath(import.meta.url)) },
};

// Turbopack needs plugin names as strings with serializable options.
const withMDX = createMDX({
  options: {
    rehypePlugins: [['rehype-pretty-code', { theme: 'vitesse-dark', keepBackground: false }]],
  },
});

export default withNextIntl(withMDX(nextConfig));
