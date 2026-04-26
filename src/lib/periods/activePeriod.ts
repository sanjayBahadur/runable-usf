import { PeriodName } from '@/src/types';

/**
 * Determines the active game period based on the provided date (defaults to now).
 * 
 * Period Definitions:
 * Dawn: 5 AM – 11 AM
 * Day: 11 AM – 11 PM (Error in docs? 11 AM - 5 PM is 6 hours, 5 PM - 11 PM is 6 hours)
 * Let's follow the docs exactly:
 * Dawn: 5 – 11 (6h)
 * Day: 11 – 17 (6h)
 * Dusk: 17 – 23 (6h)
 * Night: 23 – 5 (6h)
 */
export function getActivePeriod(date: Date = new Date()): PeriodName {
  const hour = date.getHours();

  if (hour >= 5 && hour < 11) {
    return 'Dawn';
  } else if (hour >= 11 && hour < 17) {
    return 'Day';
  } else if (hour >= 17 && hour < 23) {
    return 'Dusk';
  } else {
    return 'Night';
  }
}
