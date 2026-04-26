import { useState, useCallback } from 'react';
import { ArchiveSnapshot, GameCycle, LeaderboardEntry } from '@/src/types';
import { finalizePeriod } from '@/src/lib/periods';

type UseArchivesOptions = {
  initialArchives?: ArchiveSnapshot[];
};

export function useArchives(options: UseArchivesOptions = {}) {
  const [archives, setArchives] = useState<ArchiveSnapshot[]>(options.initialArchives || []);

  const createArchive = useCallback((
    cycle: GameCycle,
    leaderboard: LeaderboardEntry[],
    ownership: Record<string, string>,
    art: Record<string, string>,
    totalIssuesFixed: number,
    totalSightings: number
  ) => {
    const snapshot = finalizePeriod({
      cycle,
      leaderboard,
      ownership,
      art,
      totalIssuesFixed,
      totalSightings,
    });

    setArchives(prev => [snapshot, ...prev]);
    return snapshot;
  }, []);

  return {
    archives,
    createArchive,
  };
}
