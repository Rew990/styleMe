import type { WearRecord } from '@/models/WearRecord';
import { daysBetween } from './dates';

// One day an outfit was worn or is planned.
export type OutfitDay = { outfitId: string; date: string };

// The closest other day this outfit is worn or planned within `windowDays`
// of `date`, or null if there's none. Used by the Planner's warning.
export function findRepeat(
  days: OutfitDay[],
  outfitId: string,
  date: string,
  windowDays: number
): string | null {
  let closest: string | null = null;
  for (const day of days) {
    if (day.outfitId !== outfitId) continue;
    const gap = Math.abs(daysBetween(day.date, date));
    if (gap === 0 || gap > windowDays) continue;
    if (closest === null || gap < Math.abs(daysBetween(closest, date))) closest = day.date;
  }
  return closest;
}

// The ids of wear records that repeat an earlier wear of the same outfit
// within `windowDays`. Used by Wear history.
export function repeatIds(history: WearRecord[], windowDays: number): Set<string> {
  const sorted = [...history].sort((a, b) => a.wornOn.localeCompare(b.wornOn));
  const repeats = new Set<string>();
  sorted.forEach((record, i) => {
    const repeated = sorted
      .slice(0, i)
      .some((earlier) => earlier.outfitId === record.outfitId && daysBetween(earlier.wornOn, record.wornOn) <= windowDays);
    if (repeated) repeats.add(record.id);
  });
  return repeats;
}