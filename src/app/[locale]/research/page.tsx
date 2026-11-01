import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Arrow } from '@/components/icons';
import { resolveLocale } from '@/i18n/locale';
import { Link } from '@/i18n/navigation';
import { research } from '@/lib/content';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'researchPage' });
  return { title: t('metaTitle') };
}

export default async function Research() {
  const t = await getTranslations('researchPage');
  const items = await getTranslations('researchItems');
  const copy = (
    id: (typeof research)[number]['id'],
    field: 'topic' | 'title' | 'description' | 'status',
  ) => items(`${id}.${field}`);

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
        {research.map((item) => (
          <Link key={item.id} className="research-row" href={item.href}>
            <span className="research-number">{item.num}</span>
            <div>
              <span className="row-topic">{copy(item.id, 'topic')}</span>
              <h3>{copy(item.id, 'title')}</h3>
              <p>{copy(item.id, 'description')}</p>
            </div>
            <div className="row-meta">
              <span>{copy(item.id, 'status')}</span>
              <span>{item.year}</span>
            </div>
            <span className="row-arrow">
              <Arrow kind="ne" />
            </span>
          </Link>
        ))}
      </div>
      <p className="page-note">{t('note')}</p>
    </main>
  );
}
