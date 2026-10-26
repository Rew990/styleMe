import { useCallback, useState } from 'react';
import type { ClothingItem } from '@/models/ClothingItem';
import type { Outfit } from '@/models/Outfit';
import { getItems } from '@/features/wardrobe/repository';
import { deleteOutfit, getOutfits, toggleFavorite } from './repository';

export type OutfitWithItems = Outfit & { items: ClothingItem[] };

export function useSavedOutfitsViewModel() {
  const [outfits, setOutfits] = useState<OutfitWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [saved, items] = await Promise.all([getOutfits(), getItems()]);
      setOutfits(
        saved.map((o) => ({
          ...o,
          // An item may have been deleted in the Wardrobe tab: skip ids we can't find.
          items: items.filter((i) => o.itemIds.includes(i.id)),
        }))
      );
    } catch {
      setError('Could not load your outfits');
    } finally {
      setLoading(false);
    }
  }, []);

  async function favorite(id: string) {
    try {
      await toggleFavorite(id);
      setOutfits((list) => list.map((o) => (o.id === id ? { ...o, isFavorite: !o.isFavorite } : o)));
    } catch {
      setError('Could not update the outfit');
    }
  }

  async function remove(id: string) {
    try {
      await deleteOutfit(id);
      setOutfits((list) => list.filter((o) => o.id !== id));
    } catch {
      setError('Could not delete the outfit');
    }
  }

  return { outfits, loading, error, reload, favorite, remove };
}