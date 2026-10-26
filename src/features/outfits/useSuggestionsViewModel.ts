import { useState } from 'react';
import { getItems } from '@/features/wardrobe/repository';
import { addOutfit } from './repository';
import { Suggestion, suggestOutfits } from './recommendationEngine';

export function useSuggestionsViewModel() {
  const [occasion, setOccasion] = useState('Casual');
  const [weather, setWeather] = useState('Mild');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searched, setSearched] = useState(false); // false until the first search
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function findOutfits() {
    setLoading(true);
    setError(null);
    try {
      setSuggestions(suggestOutfits(await getItems(), occasion, weather));
      setSavedIds([]);
      setSearched(true);
    } catch {
      setError('Could not load your wardrobe');
    } finally {
      setLoading(false);
    }
  }

  async function save(suggestion: Suggestion) {
    try {
      await addOutfit({
        name: `${occasion} · ${weather} day`,
        itemIds: suggestion.items.map((i) => i.id),
        occasion,
      });
      setSavedIds((ids) => [...ids, suggestion.id]);
    } catch {
      setError('Could not save the outfit. Try again.');
    }
  }

  return {
    occasion, setOccasion, weather, setWeather,
    suggestions, searched, savedIds, loading, error,
    findOutfits, save,
  };
}