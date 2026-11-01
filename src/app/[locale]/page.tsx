import { getTranslations } from 'next-intl/server';
import { FlowCanvas } from '@/components/flow-canvas';
import { Arrow } from '@/components/icons';
import { Link } from '@/i18n/navigation';
import { research } from '@/lib/content';

export default async function Home() {
  const t = await getTranslations('home');
  const items = await getTranslations('researchItems');
  const copy = (
    id: (typeof research)[number]['id'],
    field: 'topic' | 'title' | 'description' | 'status',
  ) => items(`${id}.${field}`);
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-aura" />
        <FlowCanvas />
        <div className="hero-vignette" />
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">
              <span className="live-dot" /> {t('eyebrow')}
            </p>
            <h1 id="hero-title">
              {t('title')}
              <br />
              <em>{t('titleEm')}</em>
            </h1>
            <p className="hero-lede">{t('lede')}</p>
            <div className="hero-actions">
              <Link href="/research" className="button button-light">
                {t('exploreResearch')} <Arrow kind="ne" />
              </Link>
              <Link href="/writing" className="button button-glass">
                {t('readJournal')} <Arrow kind="east" />
              </Link>
            </div>
          </div>
          <div className="hero-bottom">
            <span>{t('est')}</span>
            <span>
              {t('scroll')} <Arrow kind="south" />
            </span>
          </div>
        </div>
      </section>
      <section className="section section-intro">
        <div className="section-kicker">
          <span className="crosshair">✳</span> {t('mission')}{' '}
          <span className="section-counter">001 / 003</span>
        </div>
        <div className="intro-grid">
          <h2>
            {t('introTitle')}
            <br />
            {t('introTitleLine')} <em>{t('introTitleEm')}</em>
          </h2>
          <div className="intro-description">
            <p>{t('introP1')}</p>
            <p>{t('introP2')}</p>
            <Link className="text-link" href="/research">
              {t('aboutResearch')} <Arrow kind="ne" />
            </Link>
          </div>
        </div>
      </section>
      <section className="section" id="featured">
        <div className="section-kicker">
          <span className="crosshair">✳</span> {t('investigations')}{' '}
          <span className="section-counter">002 / 003</span>
        </div>
        <div className="section-title-row">
          <h2 className="display-heading">
            {t('directions')} <em>{t('directionsEm')}</em>
          </h2>
          <Link href="/research" className="text-link">
            {t('allResearch')} <Arrow kind="ne" />
          </Link>
        </div>
        <div className="research-list">
          {research.map((item) => (
            <Link href={item.href} className="research-row" key={item.id}>
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
      </section>
      <section className="section section-cta">
        <div className="section-kicker">
          <span className="crosshair">✳</span> {t('notebook')}{' '}
          <span className="section-counter">003 / 003</span>
        </div>
        <div className="cta-panel">
          <span className="eyebrow">{t('ctaEyebrow')}</span>
          <h2>
            {t('ctaTitle')}
            <br />
            <em>{t('ctaTitleEm')}</em>
          </h2>
          <p>{t('ctaBody')}</p>
          <Link href="/experiments" className="button button-light">
            {t('enterExperiments')} <Arrow kind="ne" />
          </Link>
          <div className="cta-orbit" aria-hidden="true" />
        </div>
      </section>
    </main>
  );
}
