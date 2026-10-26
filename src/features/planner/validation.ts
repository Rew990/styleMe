import type { PlannedOutfit } from '@/models/PlannedOutfit';

export type PlanErrors = { date?: string; outfit?: string; note?: string };

export function validatePlan(
  date: string,
  outfitId: string | null,
  note: string,
  today: string,
  plans: PlannedOutfit[]
): PlanErrors {
  const errors: PlanErrors = {};
  if (!date) errors.date = 'Pick a day';
  else if (date < today) errors.date = 'Pick today or a later day';
  else if (plans.some((p) => p.date === date)) errors.date = 'You already planned an outfit for this day';
  if (!outfitId) errors.outfit = 'Pick an outfit';
  if (note.trim().length > 60) errors.note = 'Note must be 60 characters or less';
  return errors;
}
