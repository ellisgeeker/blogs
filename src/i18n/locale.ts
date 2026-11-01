import { hasLocale, type Locale } from 'next-intl';
import { routing } from './routing';

export function resolveLocale(value: string): Locale {
  return hasLocale(routing.locales, value) ? value : routing.defaultLocale;
}
