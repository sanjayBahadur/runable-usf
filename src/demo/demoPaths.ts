import type { Coordinate, RunSession } from '@/src/types';

const bullsLoop: Coordinate[] = [
  [28.0618, -82.4188],
  [28.0633, -82.4188],
  [28.064, -82.417],
  [28.0637, -82.4148],
  [28.0625, -82.4132],
  [28.0606, -82.413],
  [28.0594, -82.4144],
  [28.0596, -82.4168],
  [28.0611, -82.4183],
  [28.0618, -82.4188],
];

const herdLoop: Coordinate[] = [
  [28.0613, -82.4174],
  [28.0628, -82.4172],
  [28.0636, -82.4156],
  [28.0634, -82.4138],
  [28.0622, -82.4125],
  [28.0605, -82.4124],
  [28.0596, -82.4139],
  [28.0599, -82.416],
  [28.0613, -82.4174],
];

const roamersLoop: Coordinate[] = [
  [28.0578, -82.4184],
  [28.0592, -82.4183],
  [28.06, -82.4168],
  [28.0598, -82.4149],
  [28.0588, -82.4137],
  [28.0573, -82.4136],
  [28.0564, -82.4149],
  [28.0565, -82.4168],
  [28.0578, -82.4184],
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
