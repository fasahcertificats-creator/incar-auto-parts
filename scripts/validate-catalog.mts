import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import type { CatalogIntake } from "../src/features/catalog-intake/contracts.ts";
import {
  formatCatalogValidationReport,
  validateCatalogIntake,
  type CatalogIssueCode,
} from "../src/features/catalog-intake/validation.ts";

function validCatalog(): CatalogIntake {
  return {
    makes: [
      {
        id: "make-1",
        slug: "make-1",
        nameAr: "علامة معتمدة",
        nameEn: "Verified Make",
        status: "published",
        isSampleData: false,
        descriptionAr: "وصف معتمد.",
        descriptionEn: "Verified description.",
      },
    ],
    models: [
      {
        id: "model-1",
        slug: "model-1",
        makeId: "make-1",
        nameAr: "موديل معتمد",
        nameEn: "Verified Model",
        status: "published",
        isSampleData: false,
        descriptionAr: "وصف معتمد.",
        descriptionEn: "Verified description.",
        verifiedYearRanges: [{ from: 2020, to: 2024 }],
      },
    ],
    categories: [
      {
        id: "category-1",
        slug: "category-1",
        nameAr: "فئة معتمدة",
        nameEn: "Verified Category",
        status: "published",
        descriptionAr: "وصف معتمد.",
        descriptionEn: "Verified description.",
      },
    ],
    products: [
      {
        internalProductId: "product-1",
        slug: "product-1",
        nameAr: "منتج معتمد",
        nameEn: "Verified Product",
        publishingStatus: "published",
        isSampleData: false,
        dataVerificationState: "verified",
        compatibilityStatus: "verified",
        requestEligibility: "requestable",
        categoryId: "category-1",
        references: {
          incarPartNumber: "INCAR-100",
          oemReferences: ["OEM-100"],
          verifiedAlternateReferences: ["ALT-100"],
        },
        vehicleRelationships: [
          {
            makeId: "make-1",
            modelId: "model-1",
            compatibilityStatus: "verified",
            verifiedYearRanges: [{ from: 2020, to: 2024 }],
          },
        ],
        descriptionAr: "وصف معتمد.",
        descriptionEn: "Verified description.",
        images: [{ src: "/images/verified-product.svg" }],
        specifications: {
          material: { ar: "مادة معتمدة", en: "Verified material" },
        },
      },
    ],
  };
}

function cloneCatalog<T>(value: T): T {
  return structuredClone(value);
}

function expectCode(catalog: CatalogIntake, code: CatalogIssueCode) {
  const result = validateCatalogIntake(catalog);
  assert.equal(result.hasErrors, true, `${code} fixture should fail validation.`);
  assert.ok(
    result.report.issues.some((issue) => issue.code === code),
    `${code} was not reported.`,
  );
}

function runSelfChecks() {
  let passed = 0;
  const check = (name: string, callback: () => void) => {
    callback();
    passed += 1;
    process.stdout.write(`Self-check PASS: ${name}\n`);
  };

  check("valid empty production dataset", () => {
    const result = validateCatalogIntake({ makes: [], models: [], categories: [], products: [] });
    assert.equal(result.hasErrors, false);
    assert.equal(result.report.warningCount, 0);
  });

  check("duplicate product ID", () => {
    const catalog = validCatalog();
    const duplicate = cloneCatalog(catalog.products[0]);
    duplicate.slug = "product-2";
    duplicate.references = {
      incarPartNumber: "INCAR-200",
      oemReferences: ["OEM-200"],
      verifiedAlternateReferences: ["ALT-200"],
    };
    catalog.products.push(duplicate);
    expectCode(catalog, "DUPLICATE_INTERNAL_PRODUCT_ID");
  });

  check("duplicate normalized reference", () => {
    const catalog = validCatalog();
    const duplicate = cloneCatalog(catalog.products[0]);
    duplicate.internalProductId = "product-2";
    duplicate.slug = "product-2";
    duplicate.references = {
      incarPartNumber: "INCAR-200",
      oemReferences: ["OEM 100"],
      verifiedAlternateReferences: ["ALT-200"],
    };
    catalog.products.push(duplicate);
    expectCode(catalog, "DUPLICATE_NORMALIZED_REFERENCE");
  });

  check("missing product reference", () => {
    const catalog = validCatalog();
    catalog.products[0].references = {};
    expectCode(catalog, "MISSING_PRODUCT_REFERENCE");
  });

  check("unknown make", () => {
    const catalog = validCatalog();
    catalog.models[0].makeId = "unknown-make";
    expectCode(catalog, "UNKNOWN_MAKE");
  });

  check("unknown model", () => {
    const catalog = validCatalog();
    catalog.products[0].vehicleRelationships![0].modelId = "unknown-model";
    expectCode(catalog, "UNKNOWN_MODEL");
  });

  check("unknown category", () => {
    const catalog = validCatalog();
    catalog.products[0].categoryId = "unknown-category";
    expectCode(catalog, "UNKNOWN_CATEGORY");
  });

  check("sample record in production", () => {
    const catalog = validCatalog();
    catalog.products[0].isSampleData = true;
    expectCode(catalog, "SAMPLE_RECORD_IN_PRODUCTION");
  });

  check("broken vehicle relationship", () => {
    const catalog = validCatalog();
    catalog.makes.push({
      id: "make-2",
      slug: "make-2",
      nameAr: "علامة ثانية",
      nameEn: "Second Make",
      status: "draft",
      isSampleData: false,
    });
    catalog.products[0].vehicleRelationships![0].makeId = "make-2";
    expectCode(catalog, "BROKEN_VEHICLE_RELATIONSHIP");
  });

  check("valid product record", () => {
    const result = validateCatalogIntake(validCatalog());
    assert.equal(result.hasErrors, false);
    assert.equal(result.report.publishableRecords.products, 1);
  });

  check("warning for no image", () => {
    const catalog = validCatalog();
    delete catalog.products[0].images;
    const result = validateCatalogIntake(catalog);
    assert.equal(result.hasErrors, false);
    assert.ok(result.report.issues.some((issue) => issue.code === "NO_IMAGE"));
  });

  return passed;
}

async function main() {
  const selfCheckCount = runSelfChecks();
  const requestedPath = process.argv[2];
  const catalogPath = requestedPath
    ? path.resolve(process.cwd(), requestedPath)
    : fileURLToPath(new URL("../src/data/production/catalog.json", import.meta.url));
  const raw = JSON.parse(await readFile(catalogPath, "utf8")) as unknown;
  const result = validateCatalogIntake(raw);
  process.stdout.write(`Self-checks: ${selfCheckCount} passed\n`);
  process.stdout.write(`Source: ${catalogPath}\n`);
  process.stdout.write(`${formatCatalogValidationReport(result.report)}\n`);
  if (result.hasErrors) process.exitCode = 1;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Catalog validation failed: ${message}\n`);
  process.exitCode = 1;
});
