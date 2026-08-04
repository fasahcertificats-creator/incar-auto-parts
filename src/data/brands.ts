import type { SampleMakeRecord } from "@/types/sample-product";

export const brands: SampleMakeRecord[] = [
  {
    id: "toyota",
    slug: "toyota",
    name: "Toyota",
    displayName: "Toyota",
    isActive: true,
  },
  {
    id: "hyundai",
    slug: "hyundai",
    name: "Hyundai",
    displayName: "Hyundai",
    isActive: true,
  },
];

export const launchBrands = brands.filter((brand) => brand.isActive);
