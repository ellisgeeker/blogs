'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter as useNextRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Globe } from '@/components/icons';
import { getPathname, usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LocaleSwitcher() {
  const t = useTranslations('locale');
  const nav = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const nextRouter = useNextRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const warmed = useRef(false);

  // Fetch the other language's page before the click, so the switch has nothing to wait for.
  // The native prefetch skips next-intl's wrapper, which would also rewrite the locale cookie.
  const warm = () => {
    if (warmed.current) return;
    warmed.current = true;
    for (const code of routing.locales) {
      if (code !== locale)
        nextRouter.prefetch(getPathname({ href: pathname, locale: code, forcePrefix: true }));
    }
  };

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="locale-switcher" ref={root}>
      <button
        type="button"
        className="locale-switcher-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={nav('language')}
        onPointerEnter={warm}
        onFocus={warm}
        onClick={() => setOpen((value) => !value)}
      >
        <Globe />
      </button>
      {open ? (
        <ul className="locale-switcher-menu" role="listbox" aria-label={nav('language')}>
          {routing.locales.map((code) => (
            <li key={code} role="option" aria-selected={code === locale}>
              <button
                type="button"
                className={code === locale ? 'is-active' : undefined}
                onClick={() => {
                  // Same page in another language: keep the reader's scroll position.
                  router.replace(pathname, { locale: code, scroll: false });
                  setOpen(false);
                }}
              >
                {t(code)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
