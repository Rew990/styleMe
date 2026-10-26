import type { ClothingItem } from '@/models/ClothingItem';
import { NEUTRAL_COLORS, WEATHER_SEASONS } from './options';

export type Suggestion = { id: string; items: ClothingItem[] };

// Neutrals go with anything, and an outfit may have at most 2 other colors.
export function colorsMatch(colors: string[]): boolean {
  const others = new Set(colors.filter((c) => !NEUTRAL_COLORS.includes(c)));
  return others.size <= 2;
}

// Every top + bottom + shoes that fit the occasion and weather and whose colors match.
// In Cold weather a matching outerwear piece is added when there is one.
// The least-worn outfits come first, so the user gets fresh ideas.
export function suggestOutfits(
  items: ClothingItem[],
  occasion: string,
  weather: string,
  max = 5
): Suggestion[] {
  const seasons = WEATHER_SEASONS[weather] ?? ['All'];
  const fits = items.filter((i) => i.occasion === occasion && seasons.includes(i.season));
  const inCategory = (category: string) => fits.filter((i) => i.category === category);

  const results: Suggestion[] = [];
  for (const top of inCategory('Top')) {
    for (const bottom of inCategory('Bottom')) {
      for (const shoes of inCategory('Shoes')) {
        const base = [top, bottom, shoes];
        if (!colorsMatch(base.map((i) => i.color))) continue;
        const layer =
          weather === 'Cold'
            ? inCategory('Outerwear').find((o) => colorsMatch([...base, o].map((i) => i.color)))
            : undefined;
        const outfit = layer ? [...base, layer] : base;
        results.push({ id: outfit.map((i) => i.id).join('+'), items: outfit });
      }
    }
  }

  const timesWorn = (s: Suggestion) => s.items.reduce((sum, i) => sum + i.timesWorn, 0);
  return results.sort((a, b) => timesWorn(a) - timesWorn(b)).slice(0, max);
}