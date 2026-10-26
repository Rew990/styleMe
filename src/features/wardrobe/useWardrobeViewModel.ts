import { useCallback, useState, useMemo } from 'react';
import { ClothingItem } from '../../models/ClothingItem';
import { getItems } from './repository';

export function useWardrobeViewModel() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [season, setSeason] = useState('ALL');
  
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

  const visible = useMemo(() => {
  return items.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category;
    const matchesQuery = item.name.toLowerCase().includes(query.trim().toLowerCase());
    const matchesSeason = season === 'All' || item.season === season;
    return matchesCategory && matchesQuery && matchesSeason;
  });
}, [items, category, query, season]);
const activeFilterCount = (category !== 'All' ? 1 : 0) + (season !== 'All' ? 1 : 0);
    function clearFilters() {setCategory('All');setSeason('All');}
  return { items: visible, total: items.length, category, setCategory, loading, error, reload, query, setQuery, season, setSeason, activeFilterCount, clearFilters };
}