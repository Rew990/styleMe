// Home only reads. It loads every file it needs in one go through fileStorage.
import { readJson } from '@/services/fileStorage';
import type { ClothingItem } from '@/models/ClothingItem';
import type { Outfit } from '@/models/Outfit';
import type { PlannedOutfit } from '@/models/PlannedOutfit';
import type { WearRecord } from '@/models/WearRecord';

export type HomeData = {
  items: ClothingItem[];
  outfits: Outfit[];
  plans: PlannedOutfit[];
  history: WearRecord[];
  repeatWindowDays: number;
};

export async function getHomeData(): Promise<HomeData> {
  const [items, outfits, plans, history, settings] = await Promise.all([
    readJson<ClothingItem[]>('wardrobe'),
    readJson<Outfit[]>('outfits'),
    readJson<PlannedOutfit[]>('plans'),
    readJson<WearRecord[]>('history'),
    readJson<{ repeatWindowDays?: number }>('settings'),
  ]);
  return { items, outfits, plans, history, repeatWindowDays: settings.repeatWindowDays ?? 7 };
}