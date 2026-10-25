import { useState } from 'react';
import { ClothingItem } from '../../models/ClothingItem';
import { addItem } from './repository';
import { ItemErrors, validateItem } from './validation';

export function useAddItemViewModel(onSaved: (item: ClothingItem) => void) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [season, setSeason] = useState('All');
  const [occasion, setOccasion] = useState('Casual');
  const [errors, setErrors] = useState<ItemErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    const found = validateItem(name, category, color);
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length > 0) return;
    setSaving(true);
    try {
      const item = await addItem({ name: name.trim(), category, color: color.trim(), season, occasion, imageUri: '' });
      onSaved(item);
    } catch {
      setFormError('Could not save the item. Try again.');
    } finally {
      setSaving(false);
    }
  }

  return {
    name, setName, category, setCategory, color, setColor,
    season, setSeason, occasion, setOccasion,
    errors, formError, saving, save,
  };
}