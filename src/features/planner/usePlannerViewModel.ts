import { useCallback, useMemo, useState } from 'react';
import type { Outfit } from '@/models/Outfit';
import type { PlannedOutfit } from '@/models/PlannedOutfit';
import type { WearRecord } from '@/models/WearRecord';
import { getOutfits } from '@/features/outfits/repository';
import { markWorn } from '@/features/wardrobe/repository';
import { getSettings } from '@/features/profile/repository';
import { addOutfitEvent, removeOutfitEvent } from '@/services/calendar';
import { addPlan, addWearRecord, deletePlan, getHistory, getPlans, setCalendarEventId } from './repository';
import { findRepeat } from './repeatChecker';
import { formatDay, nextDays, todayISO } from './dates';
import { PlanErrors, validatePlan } from './validation';

export function usePlannerViewModel(initialOutfitId?: string) {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [plans, setPlans] = useState<PlannedOutfit[]>([]);
  const [history, setHistory] = useState<WearRecord[]>([]);
  const [windowDays, setWindowDays] = useState(7);
  const [calendarOn, setCalendarOn] = useState(false);
  const [date, setDate] = useState(todayISO());
  const [outfitId, setOutfitId] = useState<string | null>(initialOutfitId ?? null);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<PlanErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const today = todayISO();
  const days = useMemo(() => nextDays(14), []);

  // Called by the screen each time it comes into view, so new outfits
  // and changed settings show up straight away.
  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [o, p, h, s] = await Promise.all([getOutfits(), getPlans(), getHistory(), getSettings()]);
      setOutfits(o);
      setPlans(p);
      setHistory(h);
      setWindowDays(s.repeatWindowDays);
      setCalendarOn(s.googleConnected);
    } catch {
      setError('Could not load your plans');
    } finally {
      setLoading(false);
    }
  }, []);

  function outfitName(id: string): string {
    return outfits.find((o) => o.id === id)?.name ?? 'Deleted outfit';
  }

  // Warn when the picked outfit is worn or planned close to the picked day.
  const repeatWarning = useMemo(() => {
    if (!outfitId) return null;
    const outfitDays = [
      ...history.map((h) => ({ outfitId: h.outfitId, date: h.wornOn })),
      ...plans.map((p) => ({ outfitId: p.outfitId, date: p.date })),
    ];
    const clash = findRepeat(outfitDays, outfitId, date, windowDays);
    return clash
      ? `This outfit is also worn or planned on ${formatDay(clash)}, inside your ${windowDays}-day repeat window.`
      : null;
  }, [outfitId, date, history, plans, windowDays]);

  // Returns the errors it found, so the screen can focus the first wrong field.
  async function savePlan(): Promise<PlanErrors> {
    const found = validatePlan(date, outfitId, note, today, plans);
    setErrors(found);
    setError(null);
    if (Object.keys(found).length > 0 || !outfitId) return found;
    setSaving(true);
    try {
      const plan = await addPlan({ outfitId, date, note: note.trim() });
      setPlans((list) => [...list, plan].sort((a, b) => a.date.localeCompare(b.date)));
      setOutfitId(null);
      setNote('');
    } catch {
      setError('Could not save the plan. Try again.');
    } finally {
      setSaving(false);
    }
    return found;
  }

  async function addToCalendar(plan: PlannedOutfit) {
    setError(null);
    try {
      const eventId = await addOutfitEvent(plan.date, `Wear: ${outfitName(plan.outfitId)}`, plan.note);
      await setCalendarEventId(plan.id, eventId);
      setPlans((list) => list.map((p) => (p.id === plan.id ? { ...p, calendarEventId: eventId } : p)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add it to your calendar');
    }
  }

  // Moves the plan into the wear history and counts each piece as worn once more.
  async function woreIt(plan: PlannedOutfit) {
    setError(null);
    try {
      const record = await addWearRecord(plan.outfitId, plan.date);
      const outfit = outfits.find((o) => o.id === plan.outfitId);
      // One at a time: each markWorn rewrites wardrobe.json.
      for (const itemId of outfit?.itemIds ?? []) {
        await markWorn(itemId);
      }
      await deletePlan(plan.id);
      setHistory((list) => [record, ...list]);
      setPlans((list) => list.filter((p) => p.id !== plan.id));
    } catch {
      setError('Could not save that you wore it');
    }
  }

  async function removePlan(plan: PlannedOutfit) {
    setError(null);
    try {
      if (plan.calendarEventId) {
        // The event may already be gone from the calendar app: ignore that.
        await removeOutfitEvent(plan.calendarEventId).catch(() => undefined);
      }
      await deletePlan(plan.id);
      setPlans((list) => list.filter((p) => p.id !== plan.id));
    } catch {
      setError('Could not delete the plan');
    }
  }

  return {
    days, today, date, setDate, outfits, outfitId, setOutfitId, note, setNote,
    plans, outfitName, repeatWarning, calendarOn, windowDays,
    errors, error, loading, saving,
    reload, savePlan, addToCalendar, woreIt, removePlan,
  };
}