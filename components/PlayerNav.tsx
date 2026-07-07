import Link from 'next/link';
import type { Participant } from '@/lib/types';

interface Props {
  participants: Participant[];
  currentId: string;
}

export default function PlayerNav({ participants, currentId }: Props) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 20,
    }}>
      {participants.map(p => {
        const active = p.id === currentId;
        return (
          <Link
            key={p.id}
            href={`/players/${p.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 11px',
              borderRadius: 20,
              background: active ? '#f0c040' : 'rgba(255,255,255,0.07)',
              color: active ? '#0a1e35' : '#a0c4d8',
              fontWeight: active ? 900 : 600,
              fontSize: 13,
              border: active ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)',
              whiteSpace: 'nowrap',
            }}
          >
            {p.emoji} {p.name}
          </Link>
        );
      })}
    </div>
  );
}
