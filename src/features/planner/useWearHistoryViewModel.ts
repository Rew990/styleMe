import { useCallback, useState } from 'react';
import type { WearRecord } from '@/models/WearRecord';
import { getOutfits } from '@/features/outfits/repository';
import { getSettings } from '@/features/profile/repository';
import { deleteWearRecord, getHistory } from './repository';
import { repeatIds } from './repeatChecker';

export type HistoryRow = WearRecord & { outfitName: string; isRepeat: boolean };

export function useWearHistoryViewModel() {
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [windowDays, setWindowDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [history, outfits, settings] = await Promise.all([getHistory(), getOutfits(), getSettings()]);
      const repeats = repeatIds(history, settings.repeatWindowDays);
      setWindowDays(settings.repeatWindowDays);
      setRows(
        history.map((r) => ({
          ...r,
          outfitName: outfits.find((o) => o.id === r.outfitId)?.name ?? 'Deleted outfit',
          isRepeat: repeats.has(r.id),
        }))
      );
    } catch {
      setError('Could not load your wear history');
    } finally {
      setLoading(false);
    }
  }, []);

  async function remove(id: string) {
    try {
      await deleteWearRecord(id);
      await reload(); // repeats change when a record goes, so recount
    } catch {
      setError('Could not delete this record');
    }
  }

  return { rows, windowDays, loading, error, reload, remove };
}