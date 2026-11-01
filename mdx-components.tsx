import type { ComponentPropsWithoutRef } from 'react';
import type { MDXComponents } from 'mdx/types';
import { CodeBlock } from '@/components/code-block';
import { Link } from '@/i18n/navigation';

function MdxLink({ href = '', ...props }: ComponentPropsWithoutRef<'a'>) {
  if (href.startsWith('/')) return <Link href={href} {...props} />;
  return <a href={href} target="_blank" rel="noreferrer" {...props} />;
}

function MdxFigure(props: ComponentPropsWithoutRef<'figure'>) {
  if ('data-rehype-pretty-code-figure' in props) return <CodeBlock {...props} />;
  return <figure {...props} />;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { a: MdxLink, figure: MdxFigure, ...components };
}
