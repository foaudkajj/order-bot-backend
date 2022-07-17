export interface Name {
  tr: string;
  en: string;
}

export interface Name2 {
  tr: string;
  en: string;
}

export interface Name3 {
  tr: string;
  en: string;
}

export interface ClientDisplayName {
  tr: string;
  en: string;
}

export interface Option {
  id: string;
  product: string;
  name: Name3;
  type: number;
  price: number;
  weight: number;
  status: number;
  optionProduct: string;
  clientDisplayName: ClientDisplayName;
  optionCategories: any[];
}

export interface OptionCategory {
  id: string;
  name: Name2;
  minCount: number;
  maxCount: number;
  removeToppings: boolean;
  weight: number;
  status: number;
  options: Option[];
}

export interface Name4 {
  tr: string;
  en: string;
}

export interface Description {
  tr: string;
  en: string;
}

export interface Product {
  id: string;
  productCategory: string;
  optionCategories: OptionCategory[];
  name: Name4;
  description: Description;
  price: number;
  struckPrice: number;
  weight: number;
  status: number;
  isApproved: boolean;
  imageURL: string;
  wideImageURL: string;
  chainProduct: string;
}

export interface ProductCategory {
  id: string;
  name: Name;
  restaurant: string;
  products: Product[];
  isApproved: boolean;
  weight: number;
  status: number;
  chainProductCategory: string;
}

export interface RestaurantMenu {
  productCategories: ProductCategory[];
}
