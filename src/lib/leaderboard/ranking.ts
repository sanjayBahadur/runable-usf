import { demoGroups, demoIssues, demoRunSessions, demoSightings, runDemoTerritoryScenario } from '@/src/demo';
import { POINTS } from '@/src/constants';
import type { FeedItem, LeaderboardEntry } from '@/src/types';

const demoScenario = runDemoTerritoryScenario();

function rankEntries(
  items: Omit<LeaderboardEntry, 'rank'>[],
): LeaderboardEntry[] {
  return [...items]
    .sort((a, b) => b.points - a.points || a.displayName.localeCompare(b.displayName))
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}

export function getTopGroupsLeaderboard(): LeaderboardEntry[] {
  return rankEntries(
    demoGroups.map((group) => ({
      entityId: group.id,
      entityType: 'group' as const,
      displayName: group.name,
      points: group.totalPoints,
      change: group.id === 'group-bulls' ? 1 : 0,
    })),
  );
}

export function getTopUsersLeaderboard(userNames: Map<string, string>): LeaderboardEntry[] {
  const userPoints = new Map<string, number>();

  demoRunSessions.forEach((run) => {
    userPoints.set(run.userId, (userPoints.get(run.userId) ?? 0) + POINTS.validLoopBonus);
  });
  demoIssues.forEach((issue) => {
    userPoints.set(issue.reportedByUserId, (userPoints.get(issue.reportedByUserId) ?? 0) + POINTS.issueReported);
    if (issue.fixedByUserId) {
      userPoints.set(issue.fixedByUserId, (userPoints.get(issue.fixedByUserId) ?? 0) + POINTS.issueFixed);
    }
  });
  demoSightings.forEach((sighting) => {
    userPoints.set(sighting.reportedByUserId, (userPoints.get(sighting.reportedByUserId) ?? 0) + POINTS.sightingAdded);
  });

  return rankEntries(
    [...userPoints.entries()].map(([userId, points]) => ({
      entityId: userId,
      entityType: 'user' as const,
      displayName: userNames.get(userId) ?? userId,
      points,
    })),
  );
}

export function getMostIssuesFixedLeaderboard(userNames: Map<string, string>): LeaderboardEntry[] {
  const fixes = new Map<string, number>();

  demoIssues.forEach((issue) => {
    if (!issue.fixedByUserId) {
      return;
    }

    fixes.set(issue.fixedByUserId, (fixes.get(issue.fixedByUserId) ?? 0) + 1);
  });

  return rankEntries(
    [...fixes.entries()].map(([userId, count]) => ({
      entityId: userId,
      entityType: 'user' as const,
      displayName: userNames.get(userId) ?? userId,
      points: count,
    })),
  );
}

export function getMostCellsOwnedLeaderboard(): LeaderboardEntry[] {
  const ownedCounts = new Map<string, number>();

  demoScenario.ownership.forEach((entry) => {
    ownedCounts.set(entry.groupId, (ownedCounts.get(entry.groupId) ?? 0) + 1);
  });

  return rankEntries(
    [...ownedCounts.entries()].map(([groupId, count]) => ({
      entityId: groupId,
      entityType: 'group' as const,
      displayName: demoGroups.find((group) => group.id === groupId)?.name ?? groupId,
      points: count,
    })),
  );
}

export function getMostSightingsAddedLeaderboard(userNames: Map<string, string>): LeaderboardEntry[] {
  const sightings = new Map<string, number>();

  demoSightings.forEach((sighting) => {
    sightings.set(sighting.reportedByUserId, (sightings.get(sighting.reportedByUserId) ?? 0) + 1);
  });

  return rankEntries(
    [...sightings.entries()].map(([userId, count]) => ({
      entityId: userId,
      entityType: 'user' as const,
      displayName: userNames.get(userId) ?? userId,
      points: count,
    })),
  );
}

export function buildDemoLeaderboards(feedItems: FeedItem[], userNames: Map<string, string>) {
  return {
    topGroups: getTopGroupsLeaderboard(),
    topUsers: getTopUsersLeaderboard(userNames),
    mostIssuesFixed: getMostIssuesFixedLeaderboard(userNames),
    mostCellsOwned: getMostCellsOwnedLeaderboard(),
    mostSightingsAdded: getMostSightingsAddedLeaderboard(userNames),
    feedCount: feedItems.length,
  };
}
