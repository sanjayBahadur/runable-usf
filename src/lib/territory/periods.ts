import type { GamePeriod } from '@/src/types';

export type GamePeriodName = 'dawn' | 'day' | 'dusk' | 'night';

const PERIOD_SCHEDULE: {
  name: GamePeriodName;
  label: string;
  startHour: number;
  endHour: number;
}[] = [
  { name: 'dawn', label: 'Dawn', startHour: 5, endHour: 11 },
  { name: 'day', label: 'Day', startHour: 11, endHour: 17 },
  { name: 'dusk', label: 'Dusk', startHour: 17, endHour: 23 },
  { name: 'night', label: 'Night', startHour: 23, endHour: 5 },
];

function toIsoString(date: Date): string {
  return date.toISOString();
}

function buildPeriodWindow(date: Date, startHour: number, endHour: number) {
  const start = new Date(date);
  start.setHours(startHour, 0, 0, 0);

  const end = new Date(date);
  end.setHours(endHour, 0, 0, 0);

  if (endHour <= startHour) {
    end.setDate(end.getDate() + 1);
  }

  return { start, end };
}

export function getActiveGamePeriod(date: Date): GamePeriod & { name: GamePeriodName } {
  const hour = date.getHours();

  const activePeriod =
    PERIOD_SCHEDULE.find(({ startHour, endHour }) => {
      if (startHour < endHour) {
        return hour >= startHour && hour < endHour;
      }

      return hour >= startHour || hour < endHour;
    }) ?? PERIOD_SCHEDULE[0];

  const { start, end } = buildPeriodWindow(date, activePeriod.startHour, activePeriod.endHour);
  const calendarDay = start.toISOString().slice(0, 10);

  return {
    id: `${calendarDay}-${activePeriod.name}`,
    name: activePeriod.name,
    startAt: toIsoString(start),
    endAt: toIsoString(end),
    status: date >= start && date < end ? 'active' : 'upcoming',
  };
}
