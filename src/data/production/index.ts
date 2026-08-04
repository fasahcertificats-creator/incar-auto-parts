import rawCatalog from "./catalog.json";
import { validateCatalogIntake } from "@/features/catalog-intake/validation";

const validation = validateCatalogIntake(rawCatalog);

/** Validated and domain-mapped records only. Raw intake is never exported. */
export const productionCatalog = validation.data;

/** Internal operator diagnostics. Do not expose this through public pages. */
export const productionCatalogValidation = validation.report;
