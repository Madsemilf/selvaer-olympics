import type { Participant, Placements } from './types';

export function getOverall(stats: Participant['stats']): number {
  const vals = Object.values(stats);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export function calcLeaderboard(participants: Participant[], placements: Placements) {
  const scores: Record<string, number> = {};
  participants.forEach(p => { scores[p.id] = 0; });

  for (const eventPlacements of Object.values(placements)) {
    for (const [pid, rank] of Object.entries(eventPlacements)) {
      if (rank && scores[pid] !== undefined) {
        scores[pid] += 10 - rank; // 1st=9pts, 2nd=8pts, ..., 9th=1pt
      }
    }
  }

  return participants
    .map(p => ({ participant: p, score: scores[p.id] ?? 0 }))
    .sort((a, b) => b.score - a.score);
}
