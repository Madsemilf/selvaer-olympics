import { CORE_STAT_KEYS, type Participant, type Placements } from './types';

export function getOverall(stats: Participant['stats']): number {
  const vals = CORE_STAT_KEYS.map(key => stats[key]);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export function calcLeaderboard(participants: Participant[], placements: Placements) {
  const scores: Record<string, number> = {};
  participants.forEach(p => { scores[p.id] = 0; });

  const maxRank = participants.length;

  for (const eventPlacements of Object.values(placements)) {
    for (const [pid, rank] of Object.entries(eventPlacements)) {
      if (rank && scores[pid] !== undefined) {
        scores[pid] += Math.max(0, maxRank - rank);
      }
    }
  }

  return participants
    .map(p => ({ participant: p, score: scores[p.id] ?? 0 }))
    .sort((a, b) => b.score - a.score);
}
