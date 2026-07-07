import { getOverall } from '@/lib/scoring';
import type { Participant } from '@/lib/types';
import styles from './PlayerCard.module.css';

const STAT_LABELS: Record<string, string> = {
  styrke: 'STY',
  pilse: 'PIL',
  jogglefaktor: 'JØG',
  sjobein: 'SJØ',
  comeback: 'CMB',
  skryte: 'SKR',
};

const STAT_ORDER = ['styrke', 'pilse', 'jogglefaktor', 'sjobein', 'comeback', 'skryte'];

function tierClass(overall: number) {
  if (overall >= 75) return styles.gold;
  if (overall >= 65) return styles.silver;
  return styles.bronze;
}

export default function PlayerCard({ participant }: { participant: Participant }) {
  const overall = getOverall(participant.stats);

  return (
    <div className={`${styles.card} ${tierClass(overall)}`}>
      <div className={styles.topRow}>
        <div className={styles.overallBlock}>
          <div className={styles.overall}>{overall}</div>
          <div className={styles.position}>OVR</div>
        </div>
        <div className={styles.emblem}>{participant.emoji}</div>
      </div>

      <div className={styles.photoWrapper}>
        <img
          src={participant.photo}
          alt={participant.name}
          className={styles.photo}
        />
      </div>

      <div className={styles.name}>{participant.name}</div>
      <div className={styles.specialty}>{participant.specialty}</div>
      <hr className={styles.divider} />

      <div className={styles.stats}>
        {STAT_ORDER.map(key => (
          <div key={key} className={styles.stat}>
            <span className={styles.statVal}>
              {participant.stats[key as keyof typeof participant.stats]}
            </span>
            <span className={styles.statLabel}>{STAT_LABELS[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
