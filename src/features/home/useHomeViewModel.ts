import { useCallback, useMemo, useState } from 'react';
import { daysBetween, formatShort, greetingFor, todayKey } from './dates';
import { getHomeData, HomeData } from './repository';

export type RecentWear = { id: string; outfitName: string; wornOn: string; isRepeat: boolean };

const EMPTY: HomeData = { items: [], outfits: [], plans: [], history: [], repeatWindowDays: 7 };

export function useHomeViewModel() {
  // 1. State
  const [data, setData] = useState<HomeData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Load wardrobe, outfits, plans, history and settings
  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getHomeData());
    } catch {
      setError('Could not load your home page');
    } finally {
      setLoading(false);
    }
  }, []);

  const today = todayKey();
  const greeting = greetingFor(new Date().getHours());

  // 3. Everything the screen shows, worked out from the files
  const view = useMemo(() => {
    const { items, outfits, plans, history, repeatWindowDays } = data;
    const outfitName = (id: string) => outfits.find((o) => o.id === id)?.name ?? 'Deleted outfit';

    // Today's plan and the clothes in it
    const todayPlan = plans.find((p) => p.date === today) ?? null;
    const todayOutfit = todayPlan ? outfits.find((o) => o.id === todayPlan.outfitId) ?? null : null;
    const todayItems = todayOutfit ? items.filter((i) => todayOutfit.itemIds.includes(i.id)) : [];
    const wornToday = !!todayPlan && history.some((h) => h.outfitId === todayPlan.outfitId && h.wornOn === today);

    // Repeat warning: today's outfit was already worn inside the repeat window
    const lastWear = todayPlan
      ? history
          .filter((h) => h.outfitId === todayPlan.outfitId && h.wornOn < today)
          .sort((a, b) => b.wornOn.localeCompare(a.wornOn))[0]
      : undefined;
    const daysAgo = lastWear ? daysBetween(lastWear.wornOn, today) : null;
    const repeatWarning =
      todayOutfit && lastWear && daysAgo !== null && daysAgo <= repeatWindowDays
        ? `You wore "${todayOutfit.name}" ${daysAgo === 1 ? 'yesterday' : `${daysAgo} days ago`} (${formatShort(lastWear.wornOn)}).`
        : null;

    // Plans for the next 7 days, today not counted
    const upcomingCount = plans.filter((p) => p.date > today && daysBetween(today, p.date) <= 7).length;

    // Last 5 wears, newest first. A row is a repeat if the same outfit was worn shortly before it.
    const recent: RecentWear[] = [...history]
      .sort((a, b) => b.wornOn.localeCompare(a.wornOn))
      .slice(0, 5)
      .map((h) => ({
        id: h.id,
        outfitName: outfitName(h.outfitId),
        wornOn: h.wornOn,
        isRepeat: history.some(
          (other) =>
            other.id !== h.id &&
            other.outfitId === h.outfitId &&
            other.wornOn < h.wornOn &&
            daysBetween(other.wornOn, h.wornOn) <= repeatWindowDays
        ),
      }));

    return {
      todayPlan, todayOutfit, todayItems, wornToday, repeatWarning, upcomingCount, recent,
      itemCount: items.length,
      outfitCount: outfits.length,
      windowDays: repeatWindowDays,
    };
  }, [data, today]);

  return { ...view, today, greeting, loading, error, reload };
}