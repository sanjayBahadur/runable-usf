import { ArchiveSnapshot, GameCycle, PeriodName, ISODateString } from '@/src/types';
import { getActivePeriod } from './activePeriod';

type SnapshotData = {
  cycle: GameCycle;
  period?: PeriodName;
  winnerGroupId: string;
  winnerScore: number;
  totalCellsOwned: number;
  totalIssuesFixed: number;
  totalSightings: number;
  ownershipSnapshot: Record<string, string>;
  artSnapshot: Record<string, string>;
};

export function createArchiveSnapshot(data: SnapshotData): ArchiveSnapshot {
  const now = new Date();
  const period = data.period || (data.cycle === 'Period' ? getActivePeriod(now) : undefined);

  return {
    id: `archive-${data.cycle}-${now.getTime()}`,
    cycle: data.cycle,
    period,
    date: now.toISOString() as ISODateString,
    winnerGroupId: data.winnerGroupId,
    winnerScore: data.winnerScore,
    totalCellsOwned: data.totalCellsOwned,
    totalIssuesFixed: data.totalIssuesFixed,
    totalSightings: data.totalSightings,
    ownershipSnapshot: { ...data.ownershipSnapshot },
    artSnapshot: { ...data.artSnapshot },
  };
}
