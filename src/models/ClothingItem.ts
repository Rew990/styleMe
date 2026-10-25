export type ClothingItem = {
  id: string;
  name: string;
  category: string; // Top, Bottom, Outerwear, Shoes, Accessory
  color: string;
  season: string; // All, Summer, Winter, Spring-Autumn
  occasion: string; // Casual, Work, Formal, Sport
  imageUri: string; // '' until a photo is added
  timesWorn: number;
  createdAt: string; // ISO date, e.g. 2026-10-01T09:00:00.000Z
};