export interface ParticipantStats {
  styrke: number;
  pilse: number;
  festfaktor: number;
  sjobein: number;
  comeback: number;
  skryte: number;
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
