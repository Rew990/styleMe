import { readJson, writeJson } from '@/services/fileStorage';
import type { UserSettings } from '@/models/UserSettings';

export async function getSettings(): Promise<UserSettings> {
  return readJson<UserSettings>('settings');
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  await writeJson('settings', settings);
}