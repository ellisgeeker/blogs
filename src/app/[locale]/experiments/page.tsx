import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { TraceDemo } from '@/components/trace-demo';
import { resolveLocale } from '@/i18n/locale';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'experimentsPage' });
  return { title: t('metaTitle') };
}

export default async function Experiments() {
  const t = await getTranslations('experimentsPage');
  return (
    <main className="interior">
      <div className="page-heading">
        <p className="eyebrow">{t('eyebrow')}</p>
        <h1>
          {t('title')} <em>{t('titleEm')}</em>
        </h1>
        <p>{t('lede')}</p>
      </div>
      <TraceDemo />
    </main>
  );
}
