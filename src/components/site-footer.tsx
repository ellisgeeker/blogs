import { getTranslations } from 'next-intl/server';

export async function SiteFooter() {
  const t = await getTranslations('footer');
  return (
    <footer className="site-footer">
      <span>{t('copyright', { year: new Date().getFullYear() })}</span>
      <span>{t('tagline')}</span>
      <span>{t('note')}</span>
    </footer>
  );
}
