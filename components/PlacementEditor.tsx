'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Participant } from '@/lib/types';

interface Props {
  eventId: string;
  participants: Participant[];
  initialPlacements: Record<string, number>;
}

export default function PlacementEditor({ eventId, participants, initialPlacements }: Props) {
  const router = useRouter();
  const [placements, setPlacements] = useState<Record<string, number>>(initialPlacements);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);

  const update = (pid: string, val: string) => {
    setPlacements(prev => {
      const next = { ...prev };
      if (!val) { delete next[pid]; } else { next[pid] = parseInt(val); }
      return next;
    });
  };

  const save = () => {
    setError(false);
    startTransition(async () => {
      try {
        const res = await fetch('/api/results');
        if (!res.ok) throw new Error('failed to load results');
        const all = await res.json();
        all[eventId] = placements;
        const postRes = await fetch('/api/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(all),
        });
        if (!postRes.ok) throw new Error('failed to save results');
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        router.refresh();
      } catch {
        setError(true);
      }
    });
  };

  const usedRanks = new Set(Object.values(placements));

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {participants.map(p => {
          const current = placements[p.id];
          return (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: current ? 'rgba(240,192,64,0.08)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${current ? 'rgba(240,192,64,0.3)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 8,
                padding: '10px 14px',
              }}
            >
              <span style={{ flex: 1, fontWeight: 600, color: '#fff' }}>{p.name}</span>
              {current && (
                <span style={{ fontSize: 13, color: '#a0c4d8', fontWeight: 700 }}>
                  {current === 1 ? '🥇' : current === 2 ? '🥈' : current === 3 ? '🥉' : `${current}.`}
                </span>
              )}
              <select
                value={current ?? ''}
                onChange={e => update(p.id, e.target.value)}
                style={{
                  background: '#0d3b6e',
                  color: '#f0c040',
                  border: '1px solid rgba(240,192,64,0.4)',
                  borderRadius: 6,
                  padding: '5px 8px',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                <option value="">— plass</option>
                {Array.from({ length: 11 }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n} disabled={usedRanks.has(n) && current !== n}>
                    {n}. plass
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      <button
        onClick={save}
        disabled={isPending}
        style={{
          marginTop: 20,
          width: '100%',
          background: error ? '#c0392b' : saved ? '#1a8a4a' : isPending ? '#444' : '#f0c040',
          color: error || saved || isPending ? '#fff' : '#0a1e35',
          border: 'none',
          borderRadius: 10,
          padding: '13px 0',
          fontWeight: 900,
          fontSize: 15,
          letterSpacing: 1,
          cursor: isPending ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {isPending ? 'Lagrer...' : error ? '✗ Lagring feilet, prøv igjen' : saved ? '✓ Lagret!' : 'Lagre resultater'}
      </button>
    </div>
  );
}
