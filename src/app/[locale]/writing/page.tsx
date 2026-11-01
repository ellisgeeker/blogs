import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Arrow } from '@/components/icons';
import { resolveLocale } from '@/i18n/locale';
import { Link } from '@/i18n/navigation';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'writingPage' });
  return { title: t('metaTitle') };
}

export default async function Writing() {
  const t = await getTranslations('writingPage');
  return (
    <main className="interior">
      <div className="page-heading">
        <p className="eyebrow">{t('eyebrow')}</p>
        <h1>
          {t('title')} <em>{t('titleEm')}</em>
        </h1>
        <p>{t('lede')}</p>
      </div>
      <div className="research-list">
        <Link className="research-row" href="/writing/agent-runtime">
          <span className="research-number">01</span>
          <div>
            <span className="row-topic">{t('sampleTopic')}</span>
            <h3>{t('sampleTitle')}</h3>
            <p>{t('sampleDescription')}</p>
          </div>
          <div className="row-meta">
            <span>{t('readTime')}</span>
            <span>2026</span>
          </div>
          <span className="row-arrow">
            <Arrow kind="ne" />
          </span>
        </Link>
      </div>
    </main>
  );
}
