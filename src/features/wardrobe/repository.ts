import { deletePhoto, readJson, writeJson } from '../../services/fileStorage';
import { ClothingItem } from '../../models/ClothingItem';

// The fields the Add Item form fills in. The rest are set here.
export type NewItem = Omit<ClothingItem, 'id' | 'timesWorn' | 'createdAt'>;

export async function getItems(): Promise<ClothingItem[]> {
  const items = await readJson<ClothingItem[]>('wardrobe');
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); // newest first
}

export async function getItem(id: string): Promise<ClothingItem | null> {
  const items = await readJson<ClothingItem[]>('wardrobe');
  return items.find((i) => i.id === id) ?? null;
}

export async function addItem(fields: NewItem): Promise<ClothingItem> {
  const items = await readJson<ClothingItem[]>('wardrobe');
  const item: ClothingItem = {
    ...fields,
    id: `item-${Date.now()}`,
    timesWorn: 0,
    createdAt: new Date().toISOString(),
  };
  await writeJson('wardrobe', [...items, item]);
  return item;
}

export async function markWorn(id: string): Promise<ClothingItem | null> {
  const items = await readJson<ClothingItem[]>('wardrobe');
  const updated = items.map((i) => (i.id === id ? { ...i, timesWorn: i.timesWorn + 1 } : i));
  await writeJson('wardrobe', updated);
  return updated.find((i) => i.id === id) ?? null;
}

export async function deleteItem(id: string): Promise<void> {
  const items = await readJson<ClothingItem[]>('wardrobe');
  const item = items.find((i) => i.id === id);
  if (item) deletePhoto(item.imageUri);
  await writeJson('wardrobe', items.filter((i) => i.id !== id));
}