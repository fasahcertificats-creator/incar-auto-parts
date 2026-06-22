export type BrandName = "Toyota" | "Hyundai";

export type ProductCategory =
  | "Brake System"
  | "Suspension Parts"
  | "Filters"
  | "Engine Parts"
  | "Interior Parts";

export type ProductStatus = "active" | "draft";
export type ProductOrigin = "China";

export type Brand = {
  id: string;
  slug: string;
  name: BrandName;
  displayName: string;
  isActive: boolean;
};

export type VehicleModel = {
  id: string;
  slug: string;
  brand: BrandName;
  name: string;
  displayName: string;
  isActive: boolean;
};

export type Category = {
  id: string;
  slug: string;
  name: ProductCategory;
  displayName: string;
  description: string;
  isActive: boolean;
};

export type ProductFitment = {
  brand: BrandName;
  model: string;
  generation?: string;
  yearFrom?: number;
  yearTo?: number;
  engineNotes?: string;
  trimNotes?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: BrandName;
  vehicleModel: string;
  category: ProductCategory;
  partNumber: string;
  oemNumber: string;
  compatibility: ProductFitment[];
  imageUrl: string;
  specifications: Record<string, string>;
  moq: number;
  origin: ProductOrigin;
  privateLabelAvailable: boolean;
  status: ProductStatus;
  isSampleData: boolean;
};
