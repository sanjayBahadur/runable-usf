import type { Coordinate, RunSession } from '@/src/types';

const bullsLoop: Coordinate[] = [
  [28.0673, -82.4243],
  [28.0681, -82.4251],
  [28.0692, -82.4251],
  [28.07, -82.4242],
  [28.0701, -82.4229],
  [28.0693, -82.4219],
  [28.0681, -82.4218],
  [28.0672, -82.4228],
  [28.0673, -82.4243],
];

const herdLoop: Coordinate[] = [
  [28.068, -82.4244],
  [28.0688, -82.425],
  [28.0697, -82.4246],
  [28.0703, -82.4236],
  [28.0701, -82.4224],
  [28.0692, -82.4218],
  [28.0681, -82.422],
  [28.0676, -82.423],
  [28.068, -82.4244],
];

const roamersLoop: Coordinate[] = [
  [28.0656, -82.4234],
  [28.0662, -82.4242],
  [28.0671, -82.4241],
  [28.0674, -82.4231],
  [28.067, -82.4222],
  [28.0662, -82.4219],
  [28.0654, -82.4224],
  [28.0652, -82.423],
  [28.0656, -82.4234],
];

function buildRunSession(input: {
  id: string;
  userId: string;
  groupId: string;
  startedAt: string;
  endedAt: string;
  coordinates: Coordinate[];
}): RunSession {
  const startTime = new Date(input.startedAt).getTime();

  return {
    id: input.id,
    userId: input.userId,
    groupId: input.groupId,
    path: input.coordinates.map((coordinate, index) => ({
      coordinate,
      recordedAt: new Date(startTime + index * 60_000).toISOString(),
    })),
    startedAt: input.startedAt,
    endedAt: input.endedAt,
    distanceMeters: 0,
    status: 'completed',
  };
}

export const demoPaths = {
  bullsLoop,
  herdLoop,
  roamersLoop,
} as const;

export const demoRunSessions: RunSession[] = [
  buildRunSession({
    id: 'demo-run-bulls',
    userId: 'user-bulls-01',
    groupId: 'group-bulls',
    startedAt: '2026-04-25T13:00:00.000Z',
    endedAt: '2026-04-25T13:18:00.000Z',
    coordinates: bullsLoop,
  }),
  buildRunSession({
    id: 'demo-run-herd',
    userId: 'user-herd-01',
    groupId: 'group-herd',
    startedAt: '2026-04-25T13:30:00.000Z',
    endedAt: '2026-04-25T13:42:00.000Z',
    coordinates: herdLoop,
  }),
  buildRunSession({
    id: 'demo-run-roamers',
    userId: 'user-roamers-01',
    groupId: 'group-roamers',
    startedAt: '2026-04-25T14:05:00.000Z',
    endedAt: '2026-04-25T14:19:00.000Z',
    coordinates: roamersLoop,
  }),
];
