
import { readJson, writeJson } from '@/services/fileStorage';
import type { PlannedOutfit } from '@/models/PlannedOutfit';
import type { WearRecord } from '@/models/WearRecord';

// The fields the plan form fills in. The rest are set here.
export type NewPlan = Pick<PlannedOutfit, 'outfitId' | 'date' | 'note'>;

// Plans, soonest first.
export async function getPlans(): Promise<PlannedOutfit[]> {
  const plans = await readJson<PlannedOutfit[]>('plans');
  return [...plans].sort((a, b) => a.date.localeCompare(b.date));
}

export async function addPlan(fields: NewPlan): Promise<PlannedOutfit> {
  const plans = await readJson<PlannedOutfit[]>('plans');
  const plan: PlannedOutfit = { ...fields, id: `plan-${Date.now()}`, calendarEventId: null };
  await writeJson('plans', [...plans, plan]);
  return plan;
}

// Remember the calendar event a plan was added as (or null to forget it).
export async function setCalendarEventId(id: string, calendarEventId: string | null): Promise<void> {
  const plans = await readJson<PlannedOutfit[]>('plans');
  await writeJson('plans', plans.map((p) => (p.id === id ? { ...p, calendarEventId } : p)));
}

export async function deletePlan(id: string): Promise<void> {
  const plans = await readJson<PlannedOutfit[]>('plans');
  await writeJson('plans', plans.filter((p) => p.id !== id));
}

// Wear history, newest first.
export async function getHistory(): Promise<WearRecord[]> {
  const history = await readJson<WearRecord[]>('history');
  return [...history].sort((a, b) => b.wornOn.localeCompare(a.wornOn));
}

export async function addWearRecord(outfitId: string, wornOn: string): Promise<WearRecord> {
  const history = await readJson<WearRecord[]>('history');
  const record: WearRecord = { id: `wear-${Date.now()}`, outfitId, wornOn };
  await writeJson('history', [...history, record]);
  return record;
}

export async function deleteWearRecord(id: string): Promise<void> {
  const history = await readJson<WearRecord[]>('history');
  await writeJson('history', history.filter((r) => r.id !== id));
}