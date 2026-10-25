export const CATEGORIES = ['Top', 'Bottom', 'Outerwear','Dress', 'Shoes', 'Accessory', 'Scarves'];
export const SEASONS = ['All', 'Summer', 'Winter', 'Spring-Autumn'];
export const OCCASIONS = ['Casual', 'Work', 'Formal', 'Sport', "Beach","HomeWear", "Party"];
export type ColorOption = { name: string; hex: string };

export const COLORS: ColorOption[] = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
  { name: 'Grey', hex: '#9E9E9E' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Beige', hex: '#D8C3A5' },
  { name: 'Brown', hex: '#795548' },
  { name: 'Red', hex: '#E53935' },
  { name: 'Pink', hex: '#F48FB1' },
  { name: 'Orange', hex: '#FB8C00' },
  { name: 'Yellow', hex: '#FDD835' },
  { name: 'Green', hex: '#43A047' },
  { name: 'Blue', hex: '#1E88E5' },
  { name: 'Navy', hex: '#1A237E' },
  { name: 'Purple', hex: '#8E24AA' },
];

// The swatch color for a stored color name. Phase 2 and the other screens use this.
export function colorHex(name: string): string {
  return COLORS.find((c) => c.name === name)?.hex ?? '#CCCCCC';
}