export interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceInINR: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  isVegetarian: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  displayOrder: number;
}
