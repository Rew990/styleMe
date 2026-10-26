import type { ClothingItem } from '@/models/ClothingItem';

export type OutfitErrors = { name?: string; items?: string };

export function validateOutfit(name: string, items: ClothingItem[]): OutfitErrors {
  const errors: OutfitErrors = {};
  if (!name.trim()) errors.name = 'Name is required';
  else if (name.trim().length > 40) errors.name = 'Name must be 40 characters or less';
  if (items.length < 2) {
    errors.items = 'Pick at least 2 items';
  } else {
    // One top, one bottom, one pair of shoes... but any number of accessories.
    const categories = items.filter((i) => i.category !== 'Accessory').map((i) => i.category);
    if (new Set(categories).size !== categories.length) {
      errors.items = 'Only one item per category, except accessories';
    }
  }
  return errors;
}