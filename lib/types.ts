export const CORE_STAT_KEYS = ['styrke', 'pilse', 'jogglefaktor', 'sjobein', 'comeback', 'skryte'] as const;

export interface ParticipantStats {
  styrke: number;
  pilse: number;
  jogglefaktor: number;
  sjobein: number;
  comeback: number;
  skryte: number;
  rasisme?: number;
  empati?: number;
  damer?: number;
  penis?: string;
  maricon?: number;
}

export interface Participant {
  id: string;
  name: string;
  emoji: string;
  photo: string;
  stats: ParticipantStats;
  specialty: string;
  bio: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
}

export type Placements = Record<string, Record<string, number>>;
