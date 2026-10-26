import { useEffect, useState } from 'react';
import type { ClothingItem } from '@/models/ClothingItem';
import { getItems } from '@/features/wardrobe/repository';
import { addOutfit, getOutfit, updateOutfit } from './repository';
import { OutfitErrors, validateOutfit } from './validation';

export function useBuilderViewModel(outfitId: string | undefined, onSaved: () => void) {
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [name, setName] = useState('');
  const [occasion, setOccasion] = useState('Casual');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<OutfitErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const items = await getItems();
        setWardrobe(items);
        if (outfitId) {
          const outfit = await getOutfit(outfitId);
          if (!outfit) {
            setFormError('This outfit no longer exists');
            return;
          }
          setName(outfit.name);
          setOccasion(outfit.occasion);
          // Skip items that were deleted from the wardrobe since.
          setSelectedIds(outfit.itemIds.filter((id) => items.some((i) => i.id === id)));
        }
      } catch {
        setFormError('Could not load your wardrobe');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [outfitId]);

  function toggleItem(id: string) {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }

  // Returns the errors so the screen can focus the first wrong field.
  async function save(): Promise<OutfitErrors> {
    const selected = wardrobe.filter((i) => selectedIds.includes(i.id));
    const found = validateOutfit(name, selected);
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length > 0) return found;
    setSaving(true);
    try {
      const fields = { name: name.trim(), itemIds: selectedIds, occasion };
      if (outfitId) await updateOutfit(outfitId, fields);
      else await addOutfit(fields);
      onSaved();
    } catch {
      setFormError('Could not save the outfit. Try again.');
    } finally {
      setSaving(false);
    }
    return found;
  }

  return {
    wardrobe, name, setName, occasion, setOccasion,
    selectedIds, toggleItem, errors, formError, loading, saving,
    isEditing: Boolean(outfitId), save,
  };
}