// Local storage for StyleMe: JSON files + item photos in the app's documents folder.
// Every feature's repository.ts reads and writes through these helpers.
import { Directory, File, Paths } from 'expo-file-system';

import seedWardrobe from '../data/seed/wardrobe.json';
import seedOutfits from '../data/seed/outfits.json';
import seedPlans from '../data/seed/plans.json';
import seedHistory from '../data/seed/history.json';

// One file per data item (see docs/data-storage-plan.md).
export const DATA_FILES = {
  wardrobe: 'wardrobe.json', // ClothingItem[]
  outfits: 'outfits.json', // Outfit[]
  plans: 'plans.json', // PlannedOutfit[]
  history: 'history.json', // WearRecord[]
  settings: 'settings.json', // UserSettings
  users: 'users.json', // User[]
  session: 'session.json', // Session (who is logged in)
} as const;

export type DataFile = keyof typeof DATA_FILES;

// What each file holds before the user has added anything.
const DEFAULTS: Record<DataFile, unknown> = {
  wardrobe: [],
  outfits: [],
  plans: [],
  history: [],
  settings: { stylePreferences: [], repeatWindowDays: 7, googleConnected: false },
  users: [],
  session: null,
};

// Item photos are copied here, named after the item id (e.g. images/item-1.jpg).
export const imagesDir = new Directory(Paths.document, 'images');

function fileFor(name: DataFile): File {
  return new File(Paths.document, DATA_FILES[name]);
}

// Call once when the app starts. Creates any missing file with its empty default
// and the images folder. Existing files are never overwritten.
export async function initStorage(): Promise<void> {
  if (!imagesDir.exists) {
    imagesDir.create({ intermediates: true, idempotent: true });
  }
  for (const name of Object.keys(DATA_FILES) as DataFile[]) {
    const file = fileFor(name);
    if (!file.exists) {
      file.create();
      await file.write(JSON.stringify(DEFAULTS[name], null, 2));
    }
  }
}

// Read a whole file, e.g. readJson<ClothingItem[]>('wardrobe').
// Returns the empty default if the file is missing or not valid JSON.
export async function readJson<T>(name: DataFile): Promise<T> {
  const file = fileFor(name);
  if (!file.exists) return DEFAULTS[name] as T;
  try {
    return JSON.parse(await file.text()) as T;
  } catch {
    return DEFAULTS[name] as T;
  }
}

// Replace a whole file with new data, e.g. writeJson('wardrobe', items).
export async function writeJson<T>(name: DataFile, data: T): Promise<void> {
  const file = fileFor(name);
  if (!file.exists) file.create();
  await file.write(JSON.stringify(data, null, 2));
}

// Copy a photo from the camera or gallery into images/ and return its new uri.
// Save that uri as the item's imageUri.
export async function savePhoto(sourceUri: string, itemId: string): Promise<string> {
  const ext = sourceUri.split('?')[0].split('.').pop() || 'jpg';
  const dest = new File(imagesDir, `${itemId}.${ext}`);
  if (dest.exists) dest.delete();
  await new File(sourceUri).copy(dest);
  return dest.uri;
}

// Remove an item's photo when the item is deleted.
export function deletePhoto(imageUri: string): void {
  if (!imageUri) return;
  const file = new File(imageUri);
  if (file.exists) file.delete();
}

// Development only: fill the files with the sample data in src/data/seed,
// but only while the wardrobe is still empty, so real data is never replaced.
export async function seedSampleData(): Promise<void> {
  const items = await readJson<unknown[]>('wardrobe');
  if (items.length > 0) return;
  await writeJson('wardrobe', seedWardrobe);
  await writeJson('outfits', seedOutfits);
  await writeJson('plans', seedPlans);
  await writeJson('history', seedHistory);
}

// Development only: delete all files and photos, then recreate empty ones.
export async function resetStorage(): Promise<void> {
  for (const name of Object.keys(DATA_FILES) as DataFile[]) {
    const file = fileFor(name);
    if (file.exists) file.delete();
  }
  if (imagesDir.exists) imagesDir.delete();
  await initStorage();
}