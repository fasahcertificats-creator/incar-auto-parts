import type { BrandName, ProductCategory } from "./product";

/** Legacy fixture schema. It is never exposed as the Discovery contract. */
export type SampleMakeRecord = {
  id: string;
  slug: string;
  name: BrandName;
  displayName: string;
  isActive: boolean;
};

export type SampleModelRecord = {
  id: string;
  slug: string;
  brand: BrandName;
  name: string;
  displayName: string;
  isActive: boolean;
};

export type SampleCategoryRecord = {
  id: string;
  slug: string;
  name: ProductCategory;
  displayName: string;
  description: string;
  isActive: boolean;
};

export type SampleProductFitmentRecord = {
  brand: BrandName;
  model: string;
  generation?: string;
  yearFrom?: number;
  yearTo?: number;
  engineNotes?: string;
  trimNotes?: string;
};

export type SampleProductRecord = {
  id: string;
  slug: string;
  name: string;
  brand: BrandName;
  vehicleModel: string;
  category: ProductCategory;
  partNumber: string;
  oemNumber: string;
  compatibility: SampleProductFitmentRecord[];
  imageUrl: string;
  specifications: Record<string, string>;
  moq: number;
  origin: "China";
  privateLabelAvailable: boolean;
  status: "active" | "draft";
  isSampleData: true;
};
