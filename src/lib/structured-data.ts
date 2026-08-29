import { brand } from "@/lib/brand";
import { absoluteSiteUrl } from "@/lib/site-url";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/types";
import type { Product } from "@/types/product";

/**
 * Schema.org Product markup for a product detail page. `offers`/price/
 * availability is omitted for the vast majority of products — this is
 * still primarily a quote-based B2B site with no visible pricing, matching
 * catalog-intake/validation.ts's prohibitedCommercialFields rule on the data
 * side. Phase 3b (guest checkout) introduced a narrow, explicit exception:
 * when the product carries `availableForInstantPurchase: true` and a real
 * `directSalePriceUsd` (fetched separately — the public bulk catalog dump
 * still never carries pricing, only the single-product detail endpoint
 * does), an `offers` block is emitted for that product only.
 * `isAccessoryOrSparePartFor` is the correct Schema.org property for "this
 * part fits vehicle X" without implying the part is manufactured or
 * endorsed by that vehicle's brand.
 */
export function buildProductJsonLd(
  product: Product,
  locale: Locale,
  pricing?: { directSalePriceUsd: string; availableForInstantPurchase: true } | null,
) {
  const url = absoluteSiteUrl(`/${locale}/products/${product.slug}`);
  const description = product.description?.[locale]?.trim();
  const images = product.images.map((image) => absoluteSiteUrl(image.src));
  const compatibleVehicles = product.vehicleRelationships
    .filter((relationship) => relationship.makeName && relationship.modelName)
    .map((relationship) => ({
      "@type": "Vehicle",
      name: `${relationship.makeName} ${relationship.modelName}`,
      ...(relationship.verifiedYearRanges?.length
        ? {
            vehicleModelDate: relationship.verifiedYearRanges
              .map((range) => (range.from === range.to ? `${range.from}` : `${range.from}/${range.to}`))
              .join(", "),
          }
        : {}),
    }));
  const additionalProperty = Object.entries(product.specifications ?? {})
    .map(([key, value]) => ({ key, text: value[locale]?.trim() }))
    .filter((entry): entry is { key: string; text: string } => Boolean(entry.text))
    .map((entry) => ({ "@type": "PropertyValue", name: entry.key, value: entry.text }));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": url,
    url,
    name: product.name[locale],
    ...(description ? { description } : {}),
    ...(images.length ? { image: images } : {}),
    sku: product.references.incarPartNumber || undefined,
    mpn: product.references.oemReferences[0] || undefined,
    category: product.category || undefined,
    brand: { "@type": "Brand", name: brand.name },
    ...(compatibleVehicles.length ? { isAccessoryOrSparePartFor: compatibleVehicles } : {}),
    ...(additionalProperty.length ? { additionalProperty } : {}),
    ...(pricing?.availableForInstantPurchase
      ? {
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "USD",
            price: pricing.directSalePriceUsd,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

/**
 * Meta description built from real product facts (part number, category)
 * with the site's existing generic product-page copy as a closing line —
 * never a placeholder, but also never fabricating facts the product
 * doesn't have.
 */
export function buildProductMetaDescription(product: Product, locale: Locale, dictionary: Dictionary) {
  const primaryReference =
    product.references.incarPartNumber ?? product.references.oemReferences[0] ?? undefined;
  const categoryLabel =
    (dictionary.categories as Record<string, string | undefined>)[product.category] ?? product.category;
  const facts = [
    primaryReference ? `${dictionary.productLabels.partNumber}: ${primaryReference}` : undefined,
    categoryLabel || undefined,
  ].filter((fact): fact is string => Boolean(fact));
  const prefix = facts.length ? `${product.name[locale]} — ${facts.join(" · ")}. ` : `${product.name[locale]}. `;
  return `${prefix}${dictionary.pages.products.detailDescription}`;
}

export type ProductFaqEntry = { question: string; answer: string };

/**
 * FAQ entries grounded only in fields the product actually has populated —
 * no entry is emitted for facts the product doesn't carry.
 */
export function buildProductFaqEntries(product: Product, locale: Locale, dictionary: Dictionary): ProductFaqEntry[] {
  const copy = dictionary.discovery.product;
  const entries: ProductFaqEntry[] = [];
  const primaryReference =
    product.references.incarPartNumber ?? product.references.oemReferences[0] ?? undefined;
  if (primaryReference) {
    entries.push({ question: copy.faqPartNumberQuestion, answer: primaryReference });
  }
  const compatibleVehicles = product.vehicleRelationships
    .filter((relationship) => relationship.makeName && relationship.modelName)
    .map((relationship) => `${relationship.makeName} ${relationship.modelName}`);
  if (compatibleVehicles.length) {
    entries.push({ question: copy.faqCompatibilityQuestion, answer: compatibleVehicles.join(", ") });
    entries.push({
      question: copy.faqVerificationQuestion,
      answer: copy.compatibility[product.compatibilityStatus],
    });
  }
  return entries;
}

/**
 * FAQPage markup, built only from entries actually rendered on the page
 * (see the FAQ section in the product page component) — never emitted for
 * a product with no real, populated answers.
 */
export function buildProductFaqJsonLd(entries: ProductFaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}
