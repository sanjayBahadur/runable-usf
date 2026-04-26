import type { Sighting } from '@/src/types';

export const demoSightings: Sighting[] = [
  {
    id: 'sighting-001',
    title: 'Campus turtle by the pond',
    description: 'Small turtle spotted crossing near the water feature.',
    category: 'wildlife',
    coordinate: [28.069, -82.4225],
    reportedByUserId: 'user-herd-03',
    createdAt: '2026-04-25T11:40:00.000Z',
  },
  {
    id: 'sighting-002',
    title: 'Bull statue meetup point',
    description: 'Useful landmark for demo route orientation.',
    category: 'landmark',
    coordinate: [28.0671, -82.424],
    reportedByUserId: 'user-bulls-04',
    createdAt: '2026-04-25T11:52:00.000Z',
  },
];
