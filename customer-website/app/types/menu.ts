export type FoodType = "VEG" | "NON_VEG" | "EGG" | "VEGAN" | "JAIN";

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discountPrice?: number;
  foodType: FoodType;
  preparationTime?: number;
  calories?: number;
  isAvailable: boolean;
  isBestSeller: boolean;
  isRecommended: boolean;
  isSeasonal: boolean;
  images?: ItemImage[];
  customizationGroups?: CustomizationGroup[];
  addons?: ItemAddon[];
  rating?: number;
  totalReviews?: number;
  tags?: string[];
  ingredients?: string[];
  nutritionalInfo?: NutritionalInfo;
  category: Category;
}

export interface ItemImage {
  id: number;
  url: string;
  isPrimary: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  subCategories?: Category[];
}

export interface CustomizationGroup {
  id: number;
  name: string;
  type: "SINGLE" | "MULTIPLE";
  isRequired: boolean;
  minSelect: number;
  maxSelect: number;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: number;
  name: string;
  additionalPrice: number;
  isDefault: boolean;
  isAvailable: boolean;
}

export interface ItemAddon {
  id: number;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface NutritionalInfo {
  servingSize: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

export interface MenuSearchFilters {
  query?: string;
  categoryId?: number;
  foodType?: FoodType;
  maxPrice?: number;
  minRating?: number;
  isVeg?: boolean;
  sortBy?: "price_asc" | "price_desc" | "rating" | "popularity" | "new";
}
