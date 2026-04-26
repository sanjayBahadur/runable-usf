import type { Group } from '@/src/types';

export const demoGroups: Group[] = [
  {
    id: 'group-bulls',
    name: 'Bulls',
    slug: 'bulls',
    description: 'Campus route grinders holding the west side.',
    primaryColor: '#006747',
    accentColor: '#CFC493',
    memberCount: 18,
    totalPoints: 2840,
    createdAt: '2026-04-20T12:00:00.000Z',
  },
  {
    id: 'group-herd',
    name: 'Herd',
    slug: 'herd',
    description: 'Fast overlap specialists contesting dense cells.',
    primaryColor: '#0F766E',
    accentColor: '#67E8F9',
    memberCount: 14,
    totalPoints: 2610,
    createdAt: '2026-04-20T12:05:00.000Z',
  },
  {
    id: 'group-roamers',
    name: 'Roamers',
    slug: 'roamers',
    description: 'Demo-only third group used for map variety.',
    primaryColor: '#7C3AED',
    accentColor: '#F0ABFC',
    memberCount: 9,
    totalPoints: 1735,
    createdAt: '2026-04-20T12:10:00.000Z',
  },
];
