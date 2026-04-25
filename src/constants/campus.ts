import type { Coordinate } from '@/src/types';

export const USF_CAMPUS_BOUNDARY: Coordinate[] = [
  [28.06878, -82.42789],
  [28.07056, -82.42711],
  [28.07198, -82.42384],
  [28.07084, -82.42021],
  [28.06867, -82.41844],
  [28.06559, -82.41889],
  [28.06377, -82.4216],
  [28.06405, -82.42558],
  [28.06608, -82.42753],
  [28.06878, -82.42789],
];

export const CAMPUS_CENTER: Coordinate = [28.0679, -82.4231];

export const CAMPUS_CONFIG = {
  name: 'University of South Florida',
  shortName: 'USF',
  center: CAMPUS_CENTER,
  boundary: USF_CAMPUS_BOUNDARY,
} as const;
