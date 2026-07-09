import { notFound } from 'next/navigation';
import Link from 'next/link';
import participantsData from '@/data/participants.json';
import eventsData from '@/data/events.json';
import { getPlacements } from '@/lib/storage';
import { getOverall } from '@/lib/scoring';
import PlayerNav from '@/components/PlayerNav';
import type { Participant } from '@/lib/types';

export const dynamic = 'force-dynamic';

const participants = participantsData as Participant[];

const STAT_LABELS: Record<string, string> = {
  styrke: 'Styrke',
  pilse: 'Pilse-kapasitet',
  jogglefaktor: 'Jøgglefaktor',
  sjobein: 'Sjøbein',
  comeback: 'Comeback-evne',
  skryte: 'Skryte-nivå',
  rasisme: 'Rasisme',
  empati: 'Empati',
  damer: 'Damer',
  penis: 'Penis',
  maricon: 'Maricon',
};

function statBarColor(val: number) {
  if (val >= 80) return 'linear-gradient(90deg, #2ecc71, #27ae60)';
  if (val >= 60) return 'linear-gradient(90deg, #f39c12, #e67e22)';
  return 'linear-gradient(90deg, #e74c3c, #c0392b)';
}

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const participant = participants.find(p => p.id === id);
  if (!participant) notFound();

  const placements = await getPlacements();
  const overall = getOverall(participant.stats);

  const statEntries = Object.entries(participant.stats) as [keyof typeof participant.stats, number | string][];
  const numericStatEntries = statEntries.filter((entry): entry is [keyof typeof participant.stats, number] => typeof entry[1] === 'number');
  const bestStat = numericStatEntries.reduce((a, b) => b[1] > a[1] ? b : a);
  const worstStat = numericStatEntries.reduce((a, b) => b[1] < a[1] ? b : a);

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px 48px' }}>
      <Link href="/" style={{ color: '#a0c4d8', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
        ← Hjem
      </Link>

      <PlayerNav participants={participants} currentId={id} />

      <div style={{
        background: 'linear-gradient(160deg, #0d3b6e 0%, #0a6b52 100%)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{
            width: 96, height: 96, borderRadius: 12,
            overflow: 'hidden', background: 'rgba(0,0,0,0.3)', flexShrink: 0,
          }}>
            <img src={participant.photo} alt={participant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: 20, marginBottom: 2 }}>{participant.emoji}</div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{participant.name}</h1>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: '#f0c040', lineHeight: 1 }}>{overall}</span>
              <span style={{ color: '#a0c4d8', fontSize: 12, fontWeight: 700 }}>OVERALL</span>
            </div>
            <span style={{
              display: 'inline-block',
              background: 'rgba(240,192,64,0.15)',
              border: '1px solid rgba(240,192,64,0.35)',
              borderRadius: 6,
              padding: '3px 10px',
              fontSize: 11,
              color: '#f0c040',
              fontWeight: 700,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}>
              {participant.specialty}
            </span>
          </div>
        </div>

        {participant.bio && (
          <p style={{ color: '#c8e0ec', marginBottom: 16, fontSize: 14, lineHeight: 1.6 }}>{participant.bio}</p>
        )}

        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          <span style={{
            background: 'rgba(46,204,113,0.15)',
            border: '1px solid rgba(46,204,113,0.35)',
            borderRadius: 20,
            padding: '4px 10px',
            fontSize: 12,
            color: '#2ecc71',
            fontWeight: 700,
          }}>
            ▲ {STAT_LABELS[bestStat[0]]}
          </span>
          <span style={{
            background: 'rgba(231,76,60,0.12)',
            border: '1px solid rgba(231,76,60,0.3)',
            borderRadius: 20,
            padding: '4px 10px',
            fontSize: 12,
            color: '#e74c3c',
            fontWeight: 700,
          }}>
            ▼ {STAT_LABELS[worstStat[0]]}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {statEntries.map(([key, val]) => (
            <div key={key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#a0c4d8', fontWeight: 600 }}>{STAT_LABELS[key]}</span>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#f0c040' }}>{val}</span>
              </div>
              {typeof val === 'number' && (
                <div style={{ height: 7, background: 'rgba(0,0,0,0.35)', borderRadius: 4 }}>
                  <div style={{
                    height: '100%', width: `${Math.min(val, 100)}%`, borderRadius: 4,
                    background: statBarColor(val),
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>
        
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 900, color: '#f0c040', marginBottom: 12, letterSpacing: 1, textTransform: 'uppercase' }}>
        Grener
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {eventsData.map(e => {
          const rank = placements[e.id]?.[participant.id];
          return (
            <Link key={e.id} href={`/events/${e.id}`} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, padding: '10px 14px',
            }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{e.name}</span>
              {rank ? (
                <span style={{ fontWeight: 900, color: rank <= 3 ? '#f0c040' : '#e8f4f8', fontSize: 14 }}>
                  {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}. plass`}
                </span>
              ) : (
                <span style={{ color: '#a0c4d8', fontSize: 12 }}>Ikke satt</span>
              )}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
