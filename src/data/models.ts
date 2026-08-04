import type { SampleModelRecord } from "@/types/sample-product";

export const vehicleModels: SampleModelRecord[] = [
  { id: "toyota-camry", slug: "toyota-camry", brand: "Toyota", name: "Camry", displayName: "Camry", isActive: true },
  { id: "toyota-corolla", slug: "toyota-corolla", brand: "Toyota", name: "Corolla", displayName: "Corolla", isActive: true },
  { id: "toyota-hilux", slug: "toyota-hilux", brand: "Toyota", name: "Hilux", displayName: "Hilux", isActive: true },
  { id: "toyota-yaris", slug: "toyota-yaris", brand: "Toyota", name: "Yaris", displayName: "Yaris", isActive: true },
  { id: "toyota-land-cruiser", slug: "toyota-land-cruiser", brand: "Toyota", name: "Land Cruiser", displayName: "Land Cruiser", isActive: true },
  { id: "toyota-fortuner", slug: "toyota-fortuner", brand: "Toyota", name: "Fortuner", displayName: "Fortuner", isActive: true },
  { id: "hyundai-accent", slug: "hyundai-accent", brand: "Hyundai", name: "Accent", displayName: "Accent", isActive: true },
  { id: "hyundai-elantra", slug: "hyundai-elantra", brand: "Hyundai", name: "Elantra", displayName: "Elantra", isActive: true },
  { id: "hyundai-sonata", slug: "hyundai-sonata", brand: "Hyundai", name: "Sonata", displayName: "Sonata", isActive: true },
  { id: "hyundai-tucson", slug: "hyundai-tucson", brand: "Hyundai", name: "Tucson", displayName: "Tucson", isActive: true },
  { id: "hyundai-santa-fe", slug: "hyundai-santa-fe", brand: "Hyundai", name: "Santa Fe", displayName: "Santa Fe", isActive: true },
  { id: "hyundai-creta", slug: "hyundai-creta", brand: "Hyundai", name: "Creta", displayName: "Creta", isActive: true },
];

export const carModels = vehicleModels.reduce(
  (models, vehicle) => {
    models[vehicle.brand] = [...(models[vehicle.brand] ?? []), vehicle.name];
    return models;
  },
  {} as Record<SampleModelRecord["brand"], string[]>,
);
