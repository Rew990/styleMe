import { readJson, writeJson } from '@/services/fileStorage';
import type { Outfit } from '@/models/Outfit';

// The fields the builder fills in. The rest are set here.
export type NewOutfit = Pick<Outfit, 'name' | 'itemIds' | 'occasion'>;

export async function getOutfits(): Promise<Outfit[]> {
  const outfits = await readJson<Outfit[]>('outfits');
  // Favorites first, then newest first.
  return [...outfits].sort(
    (a, b) => Number(b.isFavorite) - Number(a.isFavorite) || b.createdAt.localeCompare(a.createdAt)
  );
}

export async function getOutfit(id: string): Promise<Outfit | null> {
  const outfits = await readJson<Outfit[]>('outfits');
  return outfits.find((o) => o.id === id) ?? null;
}

export async function addOutfit(fields: NewOutfit): Promise<Outfit> {
  const outfits = await readJson<Outfit[]>('outfits');
  const outfit: Outfit = {
    ...fields,
    id: `outfit-${Date.now()}`,
    isFavorite: false,
    createdAt: new Date().toISOString(),
  };
  await writeJson('outfits', [...outfits, outfit]);
  return outfit;
}

export async function updateOutfit(id: string, fields: NewOutfit): Promise<void> {
  const outfits = await readJson<Outfit[]>('outfits');
  await writeJson('outfits', outfits.map((o) => (o.id === id ? { ...o, ...fields } : o)));
}

export async function toggleFavorite(id: string): Promise<void> {
  const outfits = await readJson<Outfit[]>('outfits');
  await writeJson('outfits', outfits.map((o) => (o.id === id ? { ...o, isFavorite: !o.isFavorite } : o)));
}

export async function deleteOutfit(id: string): Promise<void> {
  const outfits = await readJson<Outfit[]>('outfits');
  await writeJson('outfits', outfits.filter((o) => o.id !== id));
}