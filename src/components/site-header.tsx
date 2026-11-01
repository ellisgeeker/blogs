import { getTranslations } from 'next-intl/server';
import { Arrow } from '@/components/icons';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { Link } from '@/i18n/navigation';

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <circle cx="18" cy="18" r="16.5" stroke="#9ec9c3" strokeWidth="1" />
      <circle cx="18" cy="18" r="10.2" stroke="#9ec9c3" strokeWidth="0.7" opacity="0.38" />
      <ellipse
        cx="18"
        cy="18"
        rx="16"
        ry="6.2"
        stroke="#c6a879"
        strokeWidth="0.85"
        opacity="0.78"
        transform="rotate(-32 18 18)"
      />
      <ellipse
        cx="18"
        cy="18"
        rx="16"
        ry="6.2"
        stroke="#7eb8b4"
        strokeWidth="0.65"
        opacity="0.42"
        transform="rotate(52 18 18)"
      />
      <path d="M18 3.8v4.2M18 28v4.2M3.8 18h4.2M28 18h4.2" stroke="#d7ece7" strokeWidth="1" />
      <path
        d="M12.2 11.1 23.8 13.2 21.2 24.4 11.8 22.1Z"
        stroke="#e8dfc8"
        strokeWidth="0.7"
        opacity="0.55"
      />
      <circle cx="12.2" cy="11.1" r="1.45" fill="#f7f3e9" />
      <circle cx="23.8" cy="13.2" r="1.45" fill="#f7f3e9" />
      <circle cx="21.2" cy="24.4" r="1.45" fill="#f7f3e9" />
      <circle cx="11.8" cy="22.1" r="1.45" fill="#f7f3e9" />
      <circle cx="18" cy="18" r="3.5" stroke="#e8b36a" strokeWidth="0.65" opacity="0.55" />
      <circle cx="18" cy="18" r="2.05" fill="#e8b36a" />
    </svg>
  );
}

export async function SiteHeader() {
  const t = await getTranslations('nav');
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="wordmark" href="/" aria-label={t('home')}>
          <BrandMark />
          <span>
            ELLIS<span className="wordmark-slash"> / </span>
            <span className="wordmark-lab">LAB</span>
          </span>
        </Link>
        <nav aria-label={t('main')}>
          <Link href="/research">{t('research')}</Link>
          <Link href="/writing">{t('writing')}</Link>
          <Link href="/experiments">{t('experiments')}</Link>
          <Link href="/projects">{t('projects')}</Link>
        </nav>
        <div className="header-actions">
          <LocaleSwitcher />
          <a
            className="header-link"
            href="https://github.com/ellisgeeker"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <Arrow kind="ne" />
          </a>
        </div>
      </div>
    </header>
  );
}
