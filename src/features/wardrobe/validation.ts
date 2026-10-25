export type ItemErrors = { name?: string; category?: string; color?: string };

export function validateItem(name: string, category: string, color: string): ItemErrors {
  const errors: ItemErrors = {};
  if (!name.trim()) errors.name = 'Name is required';
  else if (name.trim().length > 40) errors.name = 'Name must be 40 characters or less';
  if (!category) errors.category = 'Pick a category';
  if (!color.trim()) errors.color = 'Color is required';
  return errors;
}