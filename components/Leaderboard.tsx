import Link from 'next/link';
import type { Participant } from '@/lib/types';

interface Entry {
  participant: Participant;
  score: number;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard({ entries }: { entries: Entry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {entries.map(({ participant, score }, i) => (
        <Link
          key={participant.id}
          href={`/players/${participant.id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: i === 0 ? 'rgba(240,192,64,0.12)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${i === 0 ? 'rgba(240,192,64,0.35)' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: 8,
            padding: '10px 14px',
            textDecoration: 'none',
          }}
        >
          <span style={{ fontSize: 20, minWidth: 32, textAlign: 'center' }}>
            {MEDALS[i] ?? <span style={{ color: '#a0c4d8', fontWeight: 900, fontSize: 16 }}>{i + 1}.</span>}
          </span>
          <span style={{ flex: 1, fontWeight: 700, color: '#fff', fontSize: 15 }}>
            {participant.name}
          </span>
          <span style={{ fontWeight: 900, color: '#f0c040', fontSize: 18 }}>{score}</span>
          <span style={{ color: '#a0c4d8', fontSize: 11, marginLeft: 2 }}>pts</span>
        </Link>
      ))}
    </div>
  );
}
