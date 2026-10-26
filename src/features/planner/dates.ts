// Dates are stored as 'YYYY-MM-DD' text, like plans.json and history.json.

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Today on the phone, e.g. '2026-10-26'.
export function todayISO(): string {
  return toISODate(new Date());
}

// The next `count` days starting today: ['2026-10-26', '2026-10-27', ...]
export function nextDays(count: number, from: Date = new Date()): string[] {
  return Array.from({ length: count }, (_, i) =>
    toISODate(new Date(from.getFullYear(), from.getMonth(), from.getDate() + i))
  );
}

// Whole days from a to b. Negative when b is earlier.
export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
}

// 'Tue 27 Oct', for chips and lists.
export function formatDay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}