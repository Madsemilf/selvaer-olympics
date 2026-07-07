import { notFound } from 'next/navigation';
import Link from 'next/link';
import participantsData from '@/data/participants.json';
import eventsData from '@/data/events.json';
import { getPlacements } from '@/lib/storage';
import PlacementEditor from '@/components/PlacementEditor';
import type { Participant } from '@/lib/types';

export const dynamic = 'force-dynamic';

const participants = participantsData as Participant[];

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = eventsData.find(e => e.id === id);
  if (!event) notFound();

  const allPlacements = await getPlacements();
  const eventPlacements = allPlacements[id] ?? {};

  const ranked = [...participants].sort((a, b) => {
    const ra = eventPlacements[a.id] ?? 999;
    const rb = eventPlacements[b.id] ?? 999;
    return ra - rb;
  });

  return (
    <main style={{ maxWidth: 560, margin: '0 auto', padding: '24px 16px 48px' }}>
      <Link href="/" style={{ color: '#a0c4d8', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 20 }}>
        ← Hjem
      </Link>

      <h1 style={{ fontSize: 26, fontWeight: 900, color: '#f0c040', marginBottom: 6 }}>{event.name}</h1>
      <p style={{ color: '#a0c4d8', marginBottom: 28, fontSize: 14, lineHeight: 1.5 }}>{event.description}</p>

      <PlacementEditor
        eventId={id}
        participants={ranked}
        initialPlacements={eventPlacements}
      />
    </main>
  );
}
