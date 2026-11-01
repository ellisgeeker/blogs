import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ViewTransition } from 'react';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { resolveLocale } from '@/i18n/locale';
import { routing } from '@/i18n/routing';

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: { default: t('title'), template: t('titleTemplate') },
    description: t('description'),
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Changing locale remounts this tree; the named pair crossfades old → new
              instead of cutting straight to the new language. */}
          <ViewTransition name="locale-shell" share="auto" default="none">
            <div className="locale-shell">
              <SiteHeader />
              {children}
              <SiteFooter />
            </div>
          </ViewTransition>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
