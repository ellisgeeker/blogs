import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { Arrow } from '@/components/icons';
import { Link } from '@/i18n/navigation';

type ArticlePageProps = {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  meta: string[];
  children: ReactNode;
};

export async function ArticlePage({ eyebrow, title, lede, meta, children }: ArticlePageProps) {
  const t = await getTranslations('article');
  return (
    <main>
      <div className="article-back">
        <Link href="/writing">
          <Arrow kind="west" /> {t('back')}
        </Link>
      </div>
      <div className="article-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{lede}</p>
        <div className="article-meta">
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <div className="article-body">{children}</div>
    </main>
  );
}
