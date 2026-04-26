import type { ISODateString } from './common';

export type PeriodName = 'Dawn' | 'Day' | 'Dusk' | 'Night';
export type GameCycle = 'Period' | 'Daily' | 'Weekly';

export type ArchiveSnapshot = {
  id: string;
  cycle: GameCycle;
  period?: PeriodName; // Only defined if cycle === 'Period'
  date: ISODateString;
  winnerGroupId: string;
  winnerScore: number;
  totalCellsOwned: number;
  totalIssuesFixed: number;
  totalSightings: number;
  ownershipSnapshot: Record<string, string>;
  artSnapshot: Record<string, string>;
};
