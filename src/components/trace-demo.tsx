'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Arrow } from '@/components/icons';

const stepIds = ['receive', 'plan', 'policy', 'execute', 'checkpoint'] as const;

export function TraceDemo() {
  const t = useTranslations('trace');
  const [n, setN] = useState(0);
  const steps = stepIds.map((id) => ({
    id,
    name: t(`steps.${id}.name`),
    phase: t(`steps.${id}.phase`),
    body: t(`steps.${id}.body`),
  }));
  const pad = (value: number) => String(value).padStart(2, '0');

  return (
    <div className="trace-panel">
      <div className="trace-head">
        <span>
          <span className="live-dot" /> {t('head')}
        </span>
        <span>{t('stepOf', { current: pad(n + 1), total: pad(steps.length) })}</span>
      </div>
      <div className="trace-steps">
        {steps.map((s, i) => (
          <button
            className={'trace-step ' + (i === n ? 'active' : '') + (i < n ? ' done' : '')}
            key={s.id}
            onClick={() => setN(i)}
            aria-current={i === n ? 'step' : undefined}
          >
            <span className="trace-node">{i < n ? '✓' : pad(i + 1)}</span>
            <span>{s.name}</span>
          </button>
        ))}
      </div>
      <div className="trace-detail">
        <span className="eyebrow">{t('event', { phase: steps[n].phase, n: n + 1 })}</span>
        <h2>{steps[n].name}</h2>
        <p>{steps[n].body}</p>
      </div>
      <div className="trace-actions">
        <button onClick={() => setN(Math.max(0, n - 1))} disabled={n === 0}>
          <Arrow kind="west" /> {t('previous')}
        </button>
        <button onClick={() => setN(n === steps.length - 1 ? 0 : n + 1)}>
          {n === steps.length - 1 ? (
            <>
              {t('replay')} <Arrow kind="replay" />
            </>
          ) : (
            <>
              {t('next')} <Arrow kind="east" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
