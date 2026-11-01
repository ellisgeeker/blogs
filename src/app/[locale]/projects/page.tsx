import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { resolveLocale } from '@/i18n/locale';
import { projects } from '@/lib/content';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'projectsPage' });
  return { title: t('metaTitle') };
}

export default async function Projects() {
  const t = await getTranslations('projectsPage');
  const items = await getTranslations('projectItems');
  const copy = (id: (typeof projects)[number]['id'], field: 'label' | 'title' | 'body' | 'state') =>
    items(`${id}.${field}`);

  return (
    <main className="interior">
      <div className="page-heading">
        <p className="eyebrow">{t('eyebrow')}</p>
        <h1>
          {t('title')} <em>{t('titleEm')}</em>
        </h1>
        <p>{t('lede')}</p>
      </div>
      <div className="project-grid">
        {projects.map((item) => (
          <article className="project-card" key={item.id}>
            <p className="eyebrow">{copy(item.id, 'label')}</p>
            <h2>{copy(item.id, 'title')}</h2>
            <p>{copy(item.id, 'body')}</p>
            <div className="project-tags">
              {item.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <p className="project-state">{copy(item.id, 'state')}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
