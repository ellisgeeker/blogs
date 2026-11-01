'use client';

import { useRef, useState, type ComponentPropsWithoutRef } from 'react';
import { useTranslations } from 'next-intl';

export function CodeBlock({ children, ...props }: ComponentPropsWithoutRef<'figure'>) {
  const t = useTranslations('code');
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = root.current?.querySelector('pre code')?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <figure ref={root} {...props}>
      {children}
      <button type="button" className="code-copy" onClick={copy} aria-live="polite">
        {copied ? t('copied') : t('copy')}
      </button>
    </figure>
  );
}
