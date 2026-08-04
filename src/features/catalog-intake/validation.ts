import {
  isMakePageEligible,
  isModelPageEligible,
  isProductPublishingEligible,
} from "../discovery/eligibility.ts";
import type {
  CatalogIntake,
  CategoryIntake,
  MakeIntake,
  ModelIntake,
  ProductIntake,
} from "./contracts.ts";
import { mapCatalogIntake, type CatalogDomainData } from "./mapper.ts";
import {
  isValidCatalogSlug,
  normalizeCatalogReference,
} from "./normalization.ts";

type UnknownRecord = Record<string, unknown>;
export type CatalogEntityType = "catalog" | "make" | "model" | "category" | "product";
export type CatalogIssueLevel = "error" | "warning";

export type CatalogIssueCode =
  | "INVALID_CATALOG_SHAPE"
  | "MISSING_REQUIRED_FIELD"
  | "INVALID_FIELD_TYPE"
  | "INVALID_SLUG"
  | "DUPLICATE_MAKE_ID"
  | "DUPLICATE_MAKE_SLUG"
  | "DUPLICATE_MODEL_ID"
  | "DUPLICATE_MODEL_SLUG"
  | "DUPLICATE_CATEGORY_ID"
  | "DUPLICATE_CATEGORY_SLUG"
  | "DUPLICATE_INTERNAL_PRODUCT_ID"
  | "DUPLICATE_PRODUCT_SLUG"
  | "DUPLICATE_NORMALIZED_REFERENCE"
  | "CONFLICTING_PRODUCT_REFERENCE"
  | "MISSING_PRODUCT_REFERENCE"
  | "EMPTY_REFERENCE"
  | "INVALID_REFERENCE"
  | "UNVERIFIED_ALTERNATE_REFERENCE"
  | "UNKNOWN_MAKE"
  | "UNKNOWN_MODEL"
  | "UNKNOWN_CATEGORY"
  | "MISSING_LOCALIZED_NAME"
  | "BROKEN_VEHICLE_RELATIONSHIP"
  | "INVALID_YEAR_RANGE"
  | "INVALID_PUBLISHING_STATE"
  | "SAMPLE_RECORD_IN_PRODUCTION"
  | "PROHIBITED_COMMERCIAL_FIELD"
  | "INVALID_PROVENANCE"
  | "NO_IMAGE"
  | "MISSING_OPTIONAL_DESCRIPTION"
  | "NO_VERIFIED_YEAR_RANGE"
  | "NO_ARABIC_SPECIFICATION_TRANSLATION"
  | "NO_ALTERNATE_REFERENCE";

export type CatalogValidationIssue = {
  level: CatalogIssueLevel;
  entityType: CatalogEntityType;
  entityId: string;
  field: string;
  code: CatalogIssueCode;
  message: string;
};

type CatalogCounts = {
  makes: number;
  models: number;
  categories: number;
  products: number;
  total: number;
};

export type CatalogValidationReport = {
  totals: CatalogCounts;
  publishableRecords: CatalogCounts;
  rejectedRecords: CatalogCounts;
  errorCount: number;
  warningCount: number;
  issues: CatalogValidationIssue[];
};

export type CatalogValidationResult = {
  data: CatalogDomainData;
  report: CatalogValidationReport;
  hasErrors: boolean;
};

type ValidationContext = {
  issues: CatalogValidationIssue[];
  invalidRecords: Set<UnknownRecord>;
};

const publishingStatuses = new Set(["published", "draft", "archived"]);
const compatibilityStatuses = new Set([
  "verified",
  "requires-confirmation",
  "not-verified",
  "not-applicable",
]);
const requestEligibilityValues = new Set([
  "requestable",
  "verification-required",
  "not-currently-requestable",
]);
const verificationStates = new Set(["verified", "requires-review", "unverified"]);
const prohibitedCommercialFields = new Set([
  "price",
  "stock",
  "rating",
  "reviews",
  "availability",
  "fakeavailability",
  "moq",
  "fixedmoq",
  "leadtime",
  "fixedleadtime",
  "guaranteedleadtime",
]);

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sumCounts(counts: Omit<CatalogCounts, "total">): CatalogCounts {
  return { ...counts, total: counts.makes + counts.models + counts.categories + counts.products };
}

function addIssue(
  context: ValidationContext,
  issue: CatalogValidationIssue,
  record?: UnknownRecord,
) {
  context.issues.push(issue);
  if (issue.level === "error" && record) context.invalidRecords.add(record);
}

function entityId(record: UnknownRecord, index: number, preferredField: string) {
  const preferred = record[preferredField];
  const slug = record.slug;
  if (typeof preferred === "string" && preferred.trim()) return preferred.trim();
  if (typeof slug === "string" && slug.trim()) return slug.trim();
  return `#${index + 1}`;
}

function requiredText(
  context: ValidationContext,
  record: UnknownRecord,
  entityType: CatalogEntityType,
  id: string,
  field: string,
  missingCode: CatalogIssueCode = "MISSING_REQUIRED_FIELD",
) {
  const value = record[field];
  if (typeof value !== "string" || !value.trim()) {
    addIssue(
      context,
      {
        level: "error",
        entityType,
        entityId: id,
        field,
        code: missingCode,
        message: `${field} must be a non-empty string.`,
      },
      record,
    );
    return undefined;
  }
  return value;
}

function optionalText(
  context: ValidationContext,
  record: UnknownRecord,
  entityType: CatalogEntityType,
  id: string,
  field: string,
) {
  const value = record[field];
  if (value !== undefined && typeof value !== "string") {
    addIssue(
      context,
      {
        level: "error",
        entityType,
        entityId: id,
        field,
        code: "INVALID_FIELD_TYPE",
        message: `${field} must be a string when provided.`,
      },
      record,
    );
  }
}

function requiredBoolean(
  context: ValidationContext,
  record: UnknownRecord,
  entityType: CatalogEntityType,
  id: string,
  field: string,
) {
  if (typeof record[field] !== "boolean") {
    addIssue(
      context,
      {
        level: "error",
        entityType,
        entityId: id,
        field,
        code: "INVALID_FIELD_TYPE",
        message: `${field} must be a boolean.`,
      },
      record,
    );
  }
}

function requiredEnum(
  context: ValidationContext,
  record: UnknownRecord,
  entityType: CatalogEntityType,
  id: string,
  field: string,
  values: Set<string>,
) {
  if (typeof record[field] !== "string" || !values.has(record[field])) {
    addIssue(
      context,
      {
        level: "error",
        entityType,
        entityId: id,
        field,
        code: "INVALID_FIELD_TYPE",
        message: `${field} must be one of: ${[...values].join(", ")}.`,
      },
      record,
    );
  }
}

function validateSlug(
  context: ValidationContext,
  record: UnknownRecord,
  entityType: CatalogEntityType,
  id: string,
) {
  const slug = requiredText(context, record, entityType, id, "slug");
  if (slug && !isValidCatalogSlug(slug)) {
    addIssue(
      context,
      {
        level: "error",
        entityType,
        entityId: id,
        field: "slug",
        code: "INVALID_SLUG",
        message: "Slug must use lowercase letters, numbers, and single hyphens only.",
      },
      record,
    );
  }
}

function validateLocalizedNames(
  context: ValidationContext,
  record: UnknownRecord,
  entityType: CatalogEntityType,
  id: string,
) {
  requiredText(context, record, entityType, id, "nameAr", "MISSING_LOCALIZED_NAME");
  requiredText(context, record, entityType, id, "nameEn", "MISSING_LOCALIZED_NAME");
}

function validateDescription(
  context: ValidationContext,
  record: UnknownRecord,
  entityType: CatalogEntityType,
  id: string,
) {
  optionalText(context, record, entityType, id, "descriptionAr");
  optionalText(context, record, entityType, id, "descriptionEn");
  if (!record.descriptionAr && !record.descriptionEn) {
    addIssue(context, {
      level: "warning",
      entityType,
      entityId: id,
      field: "descriptionAr|descriptionEn",
      code: "MISSING_OPTIONAL_DESCRIPTION",
      message: "No optional localized description was provided.",
    });
  }
}

function validateProvenance(
  context: ValidationContext,
  record: UnknownRecord,
  entityType: CatalogEntityType,
  id: string,
) {
  if (record.provenance === undefined) return;
  if (!isRecord(record.provenance)) {
    addIssue(
      context,
      {
        level: "error",
        entityType,
        entityId: id,
        field: "provenance",
        code: "INVALID_PROVENANCE",
        message: "Provenance must be an object when provided.",
      },
      record,
    );
    return;
  }
  for (const field of [
    "sourceName",
    "sourceReference",
    "sourceRecordId",
    "verifiedAt",
    "verificationNotes",
  ]) {
    const value = record.provenance[field];
    if (value !== undefined && typeof value !== "string") {
      addIssue(
        context,
        {
          level: "error",
          entityType,
          entityId: id,
          field: `provenance.${field}`,
          code: "INVALID_PROVENANCE",
          message: `${field} must be a string when provided.`,
        },
        record,
      );
    }
  }
  const verifiedAt = record.provenance.verifiedAt;
  if (
    typeof verifiedAt === "string" &&
    verifiedAt.trim() &&
    Number.isNaN(Date.parse(verifiedAt))
  ) {
    addIssue(
      context,
      {
        level: "error",
        entityType,
        entityId: id,
        field: "provenance.verifiedAt",
        code: "INVALID_PROVENANCE",
        message: "verifiedAt must be a valid date-time string when provided.",
      },
      record,
    );
  }
}

function validateYearRanges(
  context: ValidationContext,
  value: unknown,
  entityType: CatalogEntityType,
  id: string,
  field: string,
  parent: UnknownRecord,
) {
  if (value === undefined) return;
  if (!Array.isArray(value)) {
    addIssue(
      context,
      {
        level: "error",
        entityType,
        entityId: id,
        field,
        code: "INVALID_YEAR_RANGE",
        message: `${field} must be an array of year ranges.`,
      },
      parent,
    );
    return;
  }
  value.forEach((range, index) => {
    if (
      !isRecord(range) ||
      typeof range.from !== "number" ||
      !Number.isFinite(range.from) ||
      typeof range.to !== "number" ||
      !Number.isFinite(range.to) ||
      range.from > range.to
    ) {
      addIssue(
        context,
        {
          level: "error",
          entityType,
          entityId: id,
          field: `${field}[${index}]`,
          code: "INVALID_YEAR_RANGE",
          message: "Year range requires finite from/to values with from less than or equal to to.",
        },
        parent,
      );
    }
  });
}

function readEntityArray(
  root: UnknownRecord,
  field: "makes" | "models" | "categories" | "products",
  entityType: CatalogEntityType,
  context: ValidationContext,
) {
  const value = root[field];
  if (!Array.isArray(value)) {
    addIssue(context, {
      level: "error",
      entityType: "catalog",
      entityId: "production-catalog",
      field,
      code: "INVALID_CATALOG_SHAPE",
      message: `${field} must be an array.`,
    });
    return { records: [] as UnknownRecord[], rawCount: 0 };
  }
  const records: UnknownRecord[] = [];
  value.forEach((item, index) => {
    if (!isRecord(item)) {
      addIssue(context, {
        level: "error",
        entityType,
        entityId: `#${index + 1}`,
        field: entityType,
        code: "INVALID_FIELD_TYPE",
        message: `${entityType} record must be an object.`,
      });
    } else {
      records.push(item);
    }
  });
  return { records, rawCount: value.length };
}

function validateMake(context: ValidationContext, record: UnknownRecord, index: number) {
  const id = entityId(record, index, "id");
  requiredText(context, record, "make", id, "id");
  validateSlug(context, record, "make", id);
  validateLocalizedNames(context, record, "make", id);
  requiredEnum(context, record, "make", id, "status", publishingStatuses);
  requiredBoolean(context, record, "make", id, "isSampleData");
  if (record.isSampleData === true) {
    addIssue(
      context,
      {
        level: "error",
        entityType: "make",
        entityId: id,
        field: "isSampleData",
        code: "SAMPLE_RECORD_IN_PRODUCTION",
        message: "Production make records must set isSampleData to false.",
      },
      record,
    );
  }
  validateDescription(context, record, "make", id);
  validateProvenance(context, record, "make", id);
}

function validateModel(context: ValidationContext, record: UnknownRecord, index: number) {
  const id = entityId(record, index, "id");
  requiredText(context, record, "model", id, "id");
  validateSlug(context, record, "model", id);
  requiredText(context, record, "model", id, "makeId");
  validateLocalizedNames(context, record, "model", id);
  requiredEnum(context, record, "model", id, "status", publishingStatuses);
  requiredBoolean(context, record, "model", id, "isSampleData");
  if (record.isSampleData === true) {
    addIssue(
      context,
      {
        level: "error",
        entityType: "model",
        entityId: id,
        field: "isSampleData",
        code: "SAMPLE_RECORD_IN_PRODUCTION",
        message: "Production model records must set isSampleData to false.",
      },
      record,
    );
  }
  validateYearRanges(context, record.verifiedYearRanges, "model", id, "verifiedYearRanges", record);
  if (!Array.isArray(record.verifiedYearRanges) || record.verifiedYearRanges.length === 0) {
    addIssue(context, {
      level: "warning",
      entityType: "model",
      entityId: id,
      field: "verifiedYearRanges",
      code: "NO_VERIFIED_YEAR_RANGE",
      message: "No verified year range was provided for this model.",
    });
  }
  validateDescription(context, record, "model", id);
  validateProvenance(context, record, "model", id);
}

function validateCategory(context: ValidationContext, record: UnknownRecord, index: number) {
  const id = entityId(record, index, "id");
  requiredText(context, record, "category", id, "id");
  validateSlug(context, record, "category", id);
  validateLocalizedNames(context, record, "category", id);
  requiredEnum(context, record, "category", id, "status", publishingStatuses);
  validateDescription(context, record, "category", id);
  validateProvenance(context, record, "category", id);
}

function validateReferenceArray(
  context: ValidationContext,
  record: UnknownRecord,
  productId: string,
  references: UnknownRecord,
  field: "oemReferences" | "verifiedAlternateReferences",
) {
  const value = references[field];
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    addIssue(
      context,
      {
        level: "error",
        entityType: "product",
        entityId: productId,
        field: `references.${field}`,
        code: "INVALID_FIELD_TYPE",
        message: `${field} must be an array of strings.`,
      },
      record,
    );
    return [];
  }
  return value.filter((reference, index): reference is string => {
    if (typeof reference !== "string" || !reference.trim()) {
      addIssue(
        context,
        {
          level: "error",
          entityType: "product",
          entityId: productId,
          field: `references.${field}[${index}]`,
          code: "EMPTY_REFERENCE",
          message: "Reference values must be non-empty strings.",
        },
        record,
      );
      return false;
    }
    if (!normalizeCatalogReference(reference)) {
      addIssue(
        context,
        {
          level: "error",
          entityType: "product",
          entityId: productId,
          field: `references.${field}[${index}]`,
          code: "INVALID_REFERENCE",
          message: "Reference must contain at least one Latin letter or number.",
        },
        record,
      );
      return false;
    }
    return true;
  });
}

function validateProduct(context: ValidationContext, record: UnknownRecord, index: number) {
  const id = entityId(record, index, "internalProductId");
  requiredText(context, record, "product", id, "internalProductId");
  validateSlug(context, record, "product", id);
  validateLocalizedNames(context, record, "product", id);
  requiredEnum(context, record, "product", id, "publishingStatus", publishingStatuses);
  requiredBoolean(context, record, "product", id, "isSampleData");
  requiredEnum(context, record, "product", id, "dataVerificationState", verificationStates);
  requiredEnum(context, record, "product", id, "compatibilityStatus", compatibilityStatuses);
  requiredEnum(context, record, "product", id, "requestEligibility", requestEligibilityValues);
  requiredText(context, record, "product", id, "categoryId");
  optionalText(context, record, "product", id, "requestEligibilityNotes");
  if (record.isSampleData === true) {
    addIssue(
      context,
      {
        level: "error",
        entityType: "product",
        entityId: id,
        field: "isSampleData",
        code: "SAMPLE_RECORD_IN_PRODUCTION",
        message: "Production product records must set isSampleData to false.",
      },
      record,
    );
  }

  for (const key of Object.keys(record)) {
    const normalizedKey = key.toLowerCase().replace(/[^a-z]/g, "");
    if (prohibitedCommercialFields.has(normalizedKey)) {
      addIssue(
        context,
        {
          level: "error",
          entityType: "product",
          entityId: id,
          field: key,
          code: "PROHIBITED_COMMERCIAL_FIELD",
          message: `${key} is not allowed in the production product contract.`,
        },
        record,
      );
    }
  }

  if (!isRecord(record.references)) {
    addIssue(
      context,
      {
        level: "error",
        entityType: "product",
        entityId: id,
        field: "references",
        code: "MISSING_PRODUCT_REFERENCE",
        message: "references must contain an INCAR part number or at least one OEM reference.",
      },
      record,
    );
  } else {
    const incar = record.references.incarPartNumber;
    if (incar !== undefined && (typeof incar !== "string" || !incar.trim())) {
      addIssue(
        context,
        {
          level: "error",
          entityType: "product",
          entityId: id,
          field: "references.incarPartNumber",
          code: "EMPTY_REFERENCE",
          message: "INCAR part number must be a non-empty string when provided.",
        },
        record,
      );
    } else if (typeof incar === "string" && !normalizeCatalogReference(incar)) {
      addIssue(
        context,
        {
          level: "error",
          entityType: "product",
          entityId: id,
          field: "references.incarPartNumber",
          code: "INVALID_REFERENCE",
          message: "INCAR part number must contain at least one Latin letter or number.",
        },
        record,
      );
    }
    const oem = validateReferenceArray(context, record, id, record.references, "oemReferences");
    const alternates = validateReferenceArray(
      context,
      record,
      id,
      record.references,
      "verifiedAlternateReferences",
    );
    if (!(typeof incar === "string" && incar.trim()) && oem.length === 0) {
      addIssue(
        context,
        {
          level: "error",
          entityType: "product",
          entityId: id,
          field: "references",
          code: "MISSING_PRODUCT_REFERENCE",
          message: "Provide an INCAR part number or at least one OEM reference.",
        },
        record,
      );
    }
    if (alternates.length === 0) {
      addIssue(context, {
        level: "warning",
        entityType: "product",
        entityId: id,
        field: "references.verifiedAlternateReferences",
        code: "NO_ALTERNATE_REFERENCE",
        message: "No verified alternate reference was provided.",
      });
    }
    if ("alternateReferences" in record.references) {
      addIssue(
        context,
        {
          level: "error",
          entityType: "product",
          entityId: id,
          field: "references.alternateReferences",
          code: "UNVERIFIED_ALTERNATE_REFERENCE",
          message: "Use verifiedAlternateReferences only after reference verification.",
        },
        record,
      );
    }
  }

  if (record.vehicleRelationships !== undefined && !Array.isArray(record.vehicleRelationships)) {
    addIssue(
      context,
      {
        level: "error",
        entityType: "product",
        entityId: id,
        field: "vehicleRelationships",
        code: "INVALID_FIELD_TYPE",
        message: "vehicleRelationships must be an array when provided.",
      },
      record,
    );
  }
  const relationships = Array.isArray(record.vehicleRelationships)
    ? record.vehicleRelationships
    : [];
  relationships.forEach((relationship, relationshipIndex) => {
    if (!isRecord(relationship)) {
      addIssue(
        context,
        {
          level: "error",
          entityType: "product",
          entityId: id,
          field: `vehicleRelationships[${relationshipIndex}]`,
          code: "BROKEN_VEHICLE_RELATIONSHIP",
          message: "Vehicle relationship must be an object.",
        },
        record,
      );
      return;
    }
    requiredText(context, relationship, "product", id, "makeId");
    requiredText(context, relationship, "product", id, "modelId");
    requiredEnum(
      context,
      relationship,
      "product",
      id,
      "compatibilityStatus",
      compatibilityStatuses,
    );
    if (context.invalidRecords.has(relationship)) context.invalidRecords.add(record);
    validateYearRanges(
      context,
      relationship.verifiedYearRanges,
      "product",
      id,
      `vehicleRelationships[${relationshipIndex}].verifiedYearRanges`,
      record,
    );
  });

  if (record.publishingStatus === "published") {
    if (record.dataVerificationState !== "verified") {
      addIssue(
        context,
        {
          level: "error",
          entityType: "product",
          entityId: id,
          field: "dataVerificationState",
          code: "INVALID_PUBLISHING_STATE",
          message: "Published products require verified production data.",
        },
        record,
      );
    }
    if (relationships.length === 0) {
      addIssue(
        context,
        {
          level: "error",
          entityType: "product",
          entityId: id,
          field: "vehicleRelationships",
          code: "BROKEN_VEHICLE_RELATIONSHIP",
          message: "Published products require at least one valid vehicle relationship.",
        },
        record,
      );
    }
    if (
      record.requestEligibility === "not-currently-requestable" &&
      !(typeof record.requestEligibilityNotes === "string" && record.requestEligibilityNotes.trim())
    ) {
      addIssue(
        context,
        {
          level: "error",
          entityType: "product",
          entityId: id,
          field: "requestEligibilityNotes",
          code: "INVALID_PUBLISHING_STATE",
          message: "Published non-requestable products require an internal explanation.",
        },
        record,
      );
    }
  }

  validateDescription(context, record, "product", id);
  if (record.image === undefined) {
    addIssue(context, {
      level: "warning",
      entityType: "product",
      entityId: id,
      field: "image",
      code: "NO_IMAGE",
      message: "No product image was provided.",
    });
  } else if (!isRecord(record.image) || typeof record.image.src !== "string" || !record.image.src.trim()) {
    addIssue(
      context,
      {
        level: "error",
        entityType: "product",
        entityId: id,
        field: "image.src",
        code: "INVALID_FIELD_TYPE",
        message: "Product image requires a non-empty src string.",
      },
      record,
    );
  }
  if (record.specifications !== undefined) {
    if (!isRecord(record.specifications)) {
      addIssue(
        context,
        {
          level: "error",
          entityType: "product",
          entityId: id,
          field: "specifications",
          code: "INVALID_FIELD_TYPE",
          message: "Specifications must be an object of localized values.",
        },
        record,
      );
    } else {
      for (const [key, specification] of Object.entries(record.specifications)) {
        if (!isRecord(specification)) {
          addIssue(
            context,
            {
              level: "error",
              entityType: "product",
              entityId: id,
              field: `specifications.${key}`,
              code: "INVALID_FIELD_TYPE",
              message: "Specification values must be localized objects.",
            },
            record,
          );
          continue;
        }
        if (specification.ar !== undefined && typeof specification.ar !== "string") {
          addIssue(
            context,
            {
              level: "error",
              entityType: "product",
              entityId: id,
              field: `specifications.${key}.ar`,
              code: "INVALID_FIELD_TYPE",
              message: "Arabic specification value must be a string.",
            },
            record,
          );
        }
        if (specification.en !== undefined && typeof specification.en !== "string") {
          addIssue(
            context,
            {
              level: "error",
              entityType: "product",
              entityId: id,
              field: `specifications.${key}.en`,
              code: "INVALID_FIELD_TYPE",
              message: "English specification value must be a string.",
            },
            record,
          );
        }
        if (!(typeof specification.ar === "string" && specification.ar.trim())) {
          addIssue(context, {
            level: "warning",
            entityType: "product",
            entityId: id,
            field: `specifications.${key}.ar`,
            code: "NO_ARABIC_SPECIFICATION_TRANSLATION",
            message: "Arabic specification translation is missing.",
          });
        }
      }
    }
  }
  validateProvenance(context, record, "product", id);
}

function duplicateCheck(
  context: ValidationContext,
  records: UnknownRecord[],
  entityType: CatalogEntityType,
  preferredField: string,
  field: string,
  code: CatalogIssueCode,
  valueFor: (record: UnknownRecord) => string | undefined,
) {
  const groups = new Map<string, UnknownRecord[]>();
  records.forEach((record) => {
    const value = valueFor(record)?.trim();
    if (!value) return;
    groups.set(value, [...(groups.get(value) ?? []), record]);
  });
  for (const [value, duplicates] of groups) {
    if (duplicates.length < 2) continue;
    duplicates.forEach((record, index) =>
      addIssue(
        context,
        {
          level: "error",
          entityType,
          entityId: entityId(record, index, preferredField),
          field,
          code,
          message: `Duplicate ${field} value: ${value}.`,
        },
        record,
      ),
    );
  }
}

function validateReferenceConflicts(context: ValidationContext, products: UnknownRecord[]) {
  const referencesByNormalizedValue = new Map<
    string,
    Array<{ record: UnknownRecord; productId: string; field: string }>
  >();

  products.forEach((record, index) => {
    if (!isRecord(record.references)) return;
    const productId = entityId(record, index, "internalProductId");
    const references: Array<{ value: string; field: string }> = [];
    if (typeof record.references.incarPartNumber === "string") {
      references.push({
        value: record.references.incarPartNumber,
        field: "references.incarPartNumber",
      });
    }
    for (const field of ["oemReferences", "verifiedAlternateReferences"] as const) {
      const values = record.references[field];
      if (!Array.isArray(values)) continue;
      values.forEach((value, referenceIndex) => {
        if (typeof value === "string") {
          references.push({ value, field: `references.${field}[${referenceIndex}]` });
        }
      });
    }

    const ownReferences = new Map<string, string>();
    references.forEach(({ value, field }) => {
      const normalized = normalizeCatalogReference(value);
      if (!normalized) return;
      const previousField = ownReferences.get(normalized);
      if (previousField) {
        addIssue(
          context,
          {
            level: "error",
            entityType: "product",
            entityId: productId,
            field,
            code: "CONFLICTING_PRODUCT_REFERENCE",
            message: `Reference conflicts with ${previousField} after normalization.`,
          },
          record,
        );
      } else {
        ownReferences.set(normalized, field);
      }
      referencesByNormalizedValue.set(normalized, [
        ...(referencesByNormalizedValue.get(normalized) ?? []),
        { record, productId, field },
      ]);
    });
  });

  for (const [normalized, matches] of referencesByNormalizedValue) {
    const distinctProducts = new Set(matches.map((match) => match.record));
    if (distinctProducts.size < 2) continue;
    matches.forEach((match) =>
      addIssue(
        context,
        {
          level: "error",
          entityType: "product",
          entityId: match.productId,
          field: match.field,
          code: "DUPLICATE_NORMALIZED_REFERENCE",
          message: `Reference ${normalized} is assigned to more than one product.`,
        },
        match.record,
      ),
    );
  }
}

function validIntake(
  makes: UnknownRecord[],
  models: UnknownRecord[],
  categories: UnknownRecord[],
  products: UnknownRecord[],
  invalidRecords: Set<UnknownRecord>,
): CatalogIntake {
  return {
    makes: makes.filter((record) => !invalidRecords.has(record)) as unknown as MakeIntake[],
    models: models.filter((record) => !invalidRecords.has(record)) as unknown as ModelIntake[],
    categories: categories.filter((record) => !invalidRecords.has(record)) as unknown as CategoryIntake[],
    products: products.filter((record) => !invalidRecords.has(record)) as unknown as ProductIntake[],
  };
}

function validateRelations(
  context: ValidationContext,
  makes: UnknownRecord[],
  models: UnknownRecord[],
  categories: UnknownRecord[],
  products: UnknownRecord[],
) {
  const makesById = new Map<string, UnknownRecord[]>();
  const modelsById = new Map<string, UnknownRecord[]>();
  const categoriesById = new Map<string, UnknownRecord[]>();
  makes.forEach((record) => {
    if (typeof record.id === "string") makesById.set(record.id.trim(), [...(makesById.get(record.id.trim()) ?? []), record]);
  });
  models.forEach((record) => {
    if (typeof record.id === "string") modelsById.set(record.id.trim(), [...(modelsById.get(record.id.trim()) ?? []), record]);
  });
  categories.forEach((record) => {
    if (typeof record.id === "string") categoriesById.set(record.id.trim(), [...(categoriesById.get(record.id.trim()) ?? []), record]);
  });

  models.forEach((record, index) => {
    const id = entityId(record, index, "id");
    const makeId = typeof record.makeId === "string" ? record.makeId.trim() : "";
    const makeRecords = makesById.get(makeId) ?? [];
    if (!makeId || makeRecords.length === 0 || makeRecords.every((make) => context.invalidRecords.has(make))) {
      addIssue(
        context,
        {
          level: "error",
          entityType: "model",
          entityId: id,
          field: "makeId",
          code: "UNKNOWN_MAKE",
          message: `Model references an unknown or rejected make: ${makeId || "(empty)"}.`,
        },
        record,
      );
    }
  });

  products.forEach((record, index) => {
    const id = entityId(record, index, "internalProductId");
    const categoryId = typeof record.categoryId === "string" ? record.categoryId.trim() : "";
    const categoryRecords = categoriesById.get(categoryId) ?? [];
    if (
      !categoryId ||
      categoryRecords.length === 0 ||
      categoryRecords.every((category) => context.invalidRecords.has(category))
    ) {
      addIssue(
        context,
        {
          level: "error",
          entityType: "product",
          entityId: id,
          field: "categoryId",
          code: "UNKNOWN_CATEGORY",
          message: `Product references an unknown or rejected category: ${categoryId || "(empty)"}.`,
        },
        record,
      );
    }

    const relationships = Array.isArray(record.vehicleRelationships)
      ? record.vehicleRelationships
      : [];
    relationships.forEach((relationship, relationshipIndex) => {
      if (!isRecord(relationship)) return;
      const makeId = typeof relationship.makeId === "string" ? relationship.makeId.trim() : "";
      const modelId = typeof relationship.modelId === "string" ? relationship.modelId.trim() : "";
      const makeRecords = makesById.get(makeId) ?? [];
      const modelRecords = modelsById.get(modelId) ?? [];
      const make = makeRecords.find((candidate) => !context.invalidRecords.has(candidate));
      const model = modelRecords.find((candidate) => !context.invalidRecords.has(candidate));
      if (!make) {
        addIssue(
          context,
          {
            level: "error",
            entityType: "product",
            entityId: id,
            field: `vehicleRelationships[${relationshipIndex}].makeId`,
            code: "UNKNOWN_MAKE",
            message: `Vehicle relationship references an unknown or rejected make: ${makeId || "(empty)"}.`,
          },
          record,
        );
      }
      if (!model) {
        addIssue(
          context,
          {
            level: "error",
            entityType: "product",
            entityId: id,
            field: `vehicleRelationships[${relationshipIndex}].modelId`,
            code: "UNKNOWN_MODEL",
            message: `Vehicle relationship references an unknown or rejected model: ${modelId || "(empty)"}.`,
          },
          record,
        );
      } else if (typeof model.makeId !== "string" || model.makeId.trim() !== makeId) {
        addIssue(
          context,
          {
            level: "error",
            entityType: "product",
            entityId: id,
            field: `vehicleRelationships[${relationshipIndex}]`,
            code: "BROKEN_VEHICLE_RELATIONSHIP",
            message: `Model ${modelId} does not belong to make ${makeId}.`,
          },
          record,
        );
      }
      if (record.publishingStatus === "published") {
        if (make?.status !== "published" || model?.status !== "published") {
          addIssue(
            context,
            {
              level: "error",
              entityType: "product",
              entityId: id,
              field: `vehicleRelationships[${relationshipIndex}]`,
              code: "INVALID_PUBLISHING_STATE",
              message: "Published products may only reference published makes and models.",
            },
            record,
          );
        }
        const category = categoryRecords.find((candidate) => !context.invalidRecords.has(candidate));
        if (category?.status !== "published") {
          addIssue(
            context,
            {
              level: "error",
              entityType: "product",
              entityId: id,
              field: "categoryId",
              code: "INVALID_PUBLISHING_STATE",
              message: "Published products may only reference a published category.",
            },
            record,
          );
        }
      }
    });
  });
}

function validatePublishingEligibility(
  context: ValidationContext,
  makes: UnknownRecord[],
  models: UnknownRecord[],
  categories: UnknownRecord[],
  products: UnknownRecord[],
) {
  const intake = validIntake(makes, models, categories, products, context.invalidRecords);
  const mapped = mapCatalogIntake(intake);
  mapped.products.forEach((product) => {
    if (product.status !== "published" || isProductPublishingEligible(product)) return;
    const raw = products.find(
      (record) => record.internalProductId === product.internalProductId,
    );
    if (!raw) return;
    addIssue(
      context,
      {
        level: "error",
        entityType: "product",
        entityId: product.internalProductId,
        field: "publishingStatus",
        code: "INVALID_PUBLISHING_STATE",
        message: "Published product does not satisfy Discovery publishing eligibility.",
      },
      raw,
    );
  });
  mapped.models.forEach((model) => {
    if (model.status !== "published" || isModelPageEligible(model, mapped.products)) return;
    const raw = models.find((record) => record.id === model.id);
    if (!raw) return;
    addIssue(
      context,
      {
        level: "error",
        entityType: "model",
        entityId: model.id,
        field: "status",
        code: "INVALID_PUBLISHING_STATE",
        message: "Published model requires at least one eligible published product.",
      },
      raw,
    );
  });
  mapped.makes.forEach((make) => {
    if (make.status !== "published" || isMakePageEligible(make, mapped.models, mapped.products)) return;
    const raw = makes.find((record) => record.id === make.id);
    if (!raw) return;
    addIssue(
      context,
      {
        level: "error",
        entityType: "make",
        entityId: make.id,
        field: "status",
        code: "INVALID_PUBLISHING_STATE",
        message: "Published make requires at least one eligible published model.",
      },
      raw,
    );
  });
}

function publishableCounts(data: CatalogDomainData): CatalogCounts {
  const products = data.products.filter(isProductPublishingEligible);
  const models = data.models.filter((model) => isModelPageEligible(model, products));
  const makes = data.makes.filter((make) => isMakePageEligible(make, models, products));
  const categoryNames = new Set(products.map((product) => product.category));
  const categories = data.categories.filter(
    (category) => category.status === "published" && categoryNames.has(category.name),
  );
  return sumCounts({
    makes: makes.length,
    models: models.length,
    categories: categories.length,
    products: products.length,
  });
}

export function validateCatalogIntake(input: unknown): CatalogValidationResult {
  const context: ValidationContext = { issues: [], invalidRecords: new Set() };
  const root = isRecord(input) ? input : {};
  if (!isRecord(input)) {
    addIssue(context, {
      level: "error",
      entityType: "catalog",
      entityId: "production-catalog",
      field: "catalog",
      code: "INVALID_CATALOG_SHAPE",
      message: "Catalog input must be an object.",
    });
  }

  const makeData = readEntityArray(root, "makes", "make", context);
  const modelData = readEntityArray(root, "models", "model", context);
  const categoryData = readEntityArray(root, "categories", "category", context);
  const productData = readEntityArray(root, "products", "product", context);
  const { records: makes } = makeData;
  const { records: models } = modelData;
  const { records: categories } = categoryData;
  const { records: products } = productData;

  makes.forEach((record, index) => validateMake(context, record, index));
  models.forEach((record, index) => validateModel(context, record, index));
  categories.forEach((record, index) => validateCategory(context, record, index));
  products.forEach((record, index) => validateProduct(context, record, index));

  duplicateCheck(context, makes, "make", "id", "id", "DUPLICATE_MAKE_ID", (record) =>
    typeof record.id === "string" ? record.id : undefined,
  );
  duplicateCheck(context, makes, "make", "id", "slug", "DUPLICATE_MAKE_SLUG", (record) =>
    typeof record.slug === "string" ? record.slug : undefined,
  );
  duplicateCheck(context, models, "model", "id", "id", "DUPLICATE_MODEL_ID", (record) =>
    typeof record.id === "string" ? record.id : undefined,
  );
  duplicateCheck(context, models, "model", "id", "slug", "DUPLICATE_MODEL_SLUG", (record) =>
    typeof record.slug === "string" && typeof record.makeId === "string"
      ? `${record.makeId.trim()}:${record.slug}`
      : undefined,
  );
  duplicateCheck(context, categories, "category", "id", "id", "DUPLICATE_CATEGORY_ID", (record) =>
    typeof record.id === "string" ? record.id : undefined,
  );
  duplicateCheck(context, categories, "category", "id", "slug", "DUPLICATE_CATEGORY_SLUG", (record) =>
    typeof record.slug === "string" ? record.slug : undefined,
  );
  duplicateCheck(
    context,
    products,
    "product",
    "internalProductId",
    "internalProductId",
    "DUPLICATE_INTERNAL_PRODUCT_ID",
    (record) => (typeof record.internalProductId === "string" ? record.internalProductId : undefined),
  );
  duplicateCheck(
    context,
    products,
    "product",
    "internalProductId",
    "slug",
    "DUPLICATE_PRODUCT_SLUG",
    (record) => (typeof record.slug === "string" ? record.slug : undefined),
  );
  validateReferenceConflicts(context, products);
  validateRelations(context, makes, models, categories, products);
  validatePublishingEligibility(context, makes, models, categories, products);

  const intake = validIntake(makes, models, categories, products, context.invalidRecords);
  const data = mapCatalogIntake(intake);
  const totals = sumCounts({
    makes: makeData.rawCount,
    models: modelData.rawCount,
    categories: categoryData.rawCount,
    products: productData.rawCount,
  });
  const rejectedRecords = sumCounts({
    makes: totals.makes - intake.makes.length,
    models: totals.models - intake.models.length,
    categories: totals.categories - intake.categories.length,
    products: totals.products - intake.products.length,
  });
  const errorCount = context.issues.filter((issue) => issue.level === "error").length;
  const warningCount = context.issues.filter((issue) => issue.level === "warning").length;
  const report: CatalogValidationReport = {
    totals,
    publishableRecords: publishableCounts(data),
    rejectedRecords,
    errorCount,
    warningCount,
    issues: context.issues,
  };

  return { data, report, hasErrors: errorCount > 0 };
}

function countLine(label: string, counts: CatalogCounts) {
  return `${label}: makes=${counts.makes}, models=${counts.models}, categories=${counts.categories}, products=${counts.products}, total=${counts.total}`;
}

export function formatCatalogValidationReport(report: CatalogValidationReport) {
  const lines = [
    "INCAR Production Catalog Validation",
    `Status: ${report.errorCount > 0 ? "INVALID" : "VALID"}`,
    countLine("Total records", report.totals),
    countLine("Publishable records", report.publishableRecords),
    countLine("Rejected records", report.rejectedRecords),
    `Errors: ${report.errorCount}`,
    `Warnings: ${report.warningCount}`,
  ];
  if (report.issues.length === 0) return [...lines, "Issues: none"].join("\n");
  lines.push("Issues:");
  report.issues.forEach((issue) => {
    lines.push(
      `- [${issue.level.toUpperCase()}] ${issue.code} ${issue.entityType}:${issue.entityId} field=${issue.field} - ${issue.message}`,
    );
  });
  return lines.join("\n");
}
