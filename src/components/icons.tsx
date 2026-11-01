import type { ReactNode } from 'react';

type ArrowKind = 'ne' | 'east' | 'south' | 'west' | 'replay';

const paths: Record<ArrowKind, ReactNode> = {
  ne: (
    <>
      <path d="M7 17 17 7" />
      <path d="M9.5 7H17v7.5" />
    </>
  ),
  east: (
    <>
      <path d="M5 12h14" />
      <path d="M13.5 6.5 19 12l-5.5 5.5" />
    </>
  ),
  south: (
    <>
      <path d="M12 5v14" />
      <path d="M6.5 13.5 12 19l5.5-5.5" />
    </>
  ),
  west: (
    <>
      <path d="M19 12H5" />
      <path d="M10.5 6.5 5 12l5.5 5.5" />
    </>
  ),
  replay: (
    <>
      <path d="M18.4 8.2A7 7 0 1 0 19 13.2" />
      <path d="M18.4 4.6V8.6h-4" />
    </>
  ),
};

export function Arrow({ kind = 'ne' }: { kind?: ArrowKind }) {
  return (
    <svg className={`icon-arrow icon-${kind}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {paths[kind]}
      </g>
    </svg>
  );
}

export function Globe() {
  return (
    <svg className="icon-arrow icon-globe" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a14 14 0 0 1 0 18" />
        <path d="M12 3a14 14 0 0 0 0 18" />
      </g>
    </svg>
  );
}
