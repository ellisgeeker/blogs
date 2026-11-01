import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArticlePage } from '@/components/article-page';
import En from '@/content/writing/agent-runtime/en.mdx';
import Zh from '@/content/writing/agent-runtime/zh.mdx';
import { resolveLocale } from '@/i18n/locale';

const bodies = { en: En, zh: Zh } satisfies Record<Locale, unknown>;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'article.agentRuntime' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function AgentRuntimeArticle({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations('article.agentRuntime');
  const Body = bodies[locale];

  return (
    <ArticlePage
      eyebrow={t('eyebrow')}
      title={
        <>
          {t('title')}
          <br />
          <em>{t('titleEm')}</em>
        </>
      }
      lede={t('lede')}
      meta={[t('year'), t('readTime'), t('kind')]}
    >
      <Body />
    </ArticlePage>
  );
}
