import Link from 'next/link';
import participantsData from '@/data/participants.json';
import eventsData from '@/data/events.json';
import { getPlacements } from '@/lib/storage';
import { calcLeaderboard } from '@/lib/scoring';
import PlayerCard from '@/components/PlayerCard';
import Leaderboard from '@/components/Leaderboard';
import type { Participant } from '@/lib/types';

export const dynamic = 'force-dynamic';

const participants = participantsData as Participant[];

export default async function Home() {
  const placements = await getPlacements();
  const leaderboard = calcLeaderboard(participants, placements);
  const hasResults = leaderboard.some(e => e.score > 0);

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '28px 16px 64px' }}>
      <header style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, color: '#f0c040', letterSpacing: 3, textTransform: 'uppercase', margin: 0 }}>
          🏆 Selvær Olympics
        </h1>
        <p style={{ color: '#a0c4d8', marginTop: 10, fontSize: 15 }}>
          Hvem tar hjem gullet?
        </p>
      </header>

      <section style={{ marginBottom: 52 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
          gap: 16,
          justifyItems: 'center',
        }}>
          {leaderboard.map(({ participant, score }, i) => (
            <Link
              key={participant.id}
              href={`/players/${participant.id}`}
              style={{ position: 'relative' }}
            >
              {hasResults && (
                <div style={{
                  position: 'absolute',
                  top: -8, right: -8,
                  width: 24, height: 24,
                  borderRadius: '50%',
                  background: i === 0 ? '#f0c040' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : '#1a3a5a',
                  color: i < 3 ? '#0a1e35' : '#e8f4f8',
                  fontWeight: 900,
                  fontSize: 11,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 1,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                }}>
                  {i + 1}
                </div>
              )}
              <PlayerCard participant={participant} />
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 44 }}>
        <h2 style={{ fontSize: 16, fontWeight: 900, color: '#f0c040', marginBottom: 14, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Sammenlagt
        </h2>
        <Leaderboard entries={leaderboard} />
      </section>

      <section>
        <h2 style={{ fontSize: 16, fontWeight: 900, color: '#f0c040', marginBottom: 14, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Grener
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {eventsData.map(e => {
            const eventPlacements = placements[e.id] ?? {};
            const doneCount = Object.keys(eventPlacements).length;
            return (
              <Link
                key={e.id}
                href={`/events/${e.id}`}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(240,192,64,0.18)',
                  borderRadius: 10,
                  padding: '13px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{e.name}</div>
                  <div style={{ fontSize: 12, color: '#a0c4d8', marginTop: 2 }}>{e.description}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {doneCount > 0 && (
                    <span style={{ fontSize: 12, color: doneCount === 10 ? '#2ecc71' : '#a0c4d8' }}>
                      {doneCount}/10
                    </span>
                  )}
                  <span style={{ color: '#f0c040', fontSize: 18 }}>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
