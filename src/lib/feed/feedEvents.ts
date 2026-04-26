import { POINTS } from '@/src/constants';
import { demoGroups, demoIssues, demoRunSessions, demoSightings } from '@/src/demo';
import type { FeedItem, Group } from '@/src/types';

const groupsById = new Map(demoGroups.map((group) => [group.id, group]));

function getGroupName(groupId?: string): string {
  return groupsById.get(groupId ?? '')?.name ?? 'Unknown Group';
}

export function buildDemoFeedEvents(): FeedItem[] {
  const runEvents: FeedItem[] = demoRunSessions.slice(0, 2).map((runSession) => ({
    id: `feed-run-${runSession.id}`,
    type: 'run_completed',
    actorUserId: runSession.userId,
    groupId: runSession.groupId,
    title: 'Run completed',
    body: `${getGroupName(runSession.groupId)} closed a scoring demo loop.`,
    relatedEntityId: runSession.id,
    createdAt: runSession.endedAt ?? runSession.startedAt,
  }));

  const territoryEvents: FeedItem[] = demoRunSessions.slice(0, 2).map((runSession) => ({
    id: `feed-claim-${runSession.id}`,
    type: 'territory_claimed',
    actorUserId: runSession.userId,
    groupId: runSession.groupId,
    title: 'Territory claimed',
    body: `${getGroupName(runSession.groupId)} expanded owned cells from a demo claim.`,
    relatedEntityId: runSession.id,
    createdAt: runSession.endedAt ?? runSession.startedAt,
  }));

  const issueEvents: FeedItem[] = demoIssues.map((issue) => ({
    id: `feed-issue-${issue.id}`,
    type: issue.status === 'fixed' ? 'issue_fixed' : 'issue_reported',
    actorUserId: issue.status === 'fixed' ? issue.fixedByUserId ?? issue.reportedByUserId : issue.reportedByUserId,
    groupId: issue.status === 'fixed' ? demoGroups[0]?.id : undefined,
    title: issue.status === 'fixed' ? 'Issue fixed' : 'Issue reported',
    body:
      issue.status === 'fixed'
        ? `${issue.title} was fixed for ${POINTS.issueFixed} pts.`
        : `${issue.title} was reported under ${issue.category}.`,
    relatedEntityId: issue.id,
    createdAt: issue.fixedAt ?? issue.createdAt,
  }));

  const sightingEvents: FeedItem[] = demoSightings.map((sighting) => ({
    id: `feed-sighting-${sighting.id}`,
    type: 'sighting_added',
    actorUserId: sighting.reportedByUserId,
    title: 'Sighting added',
    body: `${sighting.title} was added as a ${sighting.category} sighting.`,
    relatedEntityId: sighting.id,
    createdAt: sighting.createdAt,
  }));

  const artEvent: FeedItem = {
    id: 'feed-art-demo',
    type: 'art_updated',
    actorUserId: 'user-bulls-demo',
    groupId: demoGroups[0]?.id,
    title: 'Cell painted',
    body: `${getGroupName(demoGroups[0]?.id)} updated campus cell art in the live demo.`,
    relatedEntityId: 'art-demo-cell',
    createdAt: '2026-04-25T14:22:00.000Z',
  };

  const landmarkEvent: FeedItem = {
    id: 'feed-landmark-demo',
    type: 'landmark_named',
    actorUserId: 'user-bulls-04',
    groupId: demoGroups[0]?.id,
    title: 'Landmark named',
    body: 'Bull statue meetup point was named for easier team routing.',
    relatedEntityId: 'landmark-bull-statue',
    createdAt: '2026-04-25T11:58:00.000Z',
  };

  return [...runEvents, ...territoryEvents, ...issueEvents, ...sightingEvents, artEvent, landmarkEvent]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getDemoUserNames(groups: Group[]) {
  return new Map<string, string>([
    ['user-bulls-01', 'Tori Bulls'],
    ['user-herd-01', 'Mika Herd'],
    ['user-roamers-01', 'Sam Roamer'],
    ['user-bulls-02', 'Ari Bulls'],
    ['user-herd-02', 'Jules Herd'],
    ['user-roamers-02', 'Nico Roamer'],
    ['user-bulls-03', 'Casey Bulls'],
    ['user-herd-03', 'Rin Herd'],
    ['user-bulls-04', 'Devon Bulls'],
    ['user-bulls-demo', `${groups[0]?.name ?? 'Demo'} Painter`],
  ]);
}
