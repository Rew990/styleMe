import { useCallback, useState } from 'react';
import { ClothingItem } from '../../models/ClothingItem';
import { getItems } from './repository';

export function useWardrobeViewModel() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await getItems());
    } catch {
      setError('Could not load your wardrobe');
    } finally {
      setLoading(false);
    }
  }, []);

  const visible = category === 'All' ? items : items.filter((i) => i.category === category);

  return { items: visible, total: items.length, category, setCategory, loading, error, reload };
}