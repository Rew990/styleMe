import { useEffect, useState } from 'react';
import { ClothingItem } from '../../models/ClothingItem';
import { deleteItem, getItem, markWorn } from './repository';

export function useItemDetailsViewModel(id: string, onDeleted: () => void) {
  const [item, setItem] = useState<ClothingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getItem(id)
      .then((found) => {
        setItem(found);
        if (!found) setError('This item no longer exists');
      })
      .catch(() => setError('Could not load this item'))
      .finally(() => setLoading(false));
  }, [id]);

  async function wearToday() {
    try {
      setItem(await markWorn(id));
    } catch {
      setError('Could not update the item');
    }
  }

  async function remove() {
    try {
      await deleteItem(id);
      onDeleted();
    } catch {
      setError('Could not delete the item');
    }
  }

  return { item, loading, error, wearToday, remove };
}