import { defaultLocale, isLocale } from "./config";
import type { Locale } from "./types";

const legacyPathMap: Record<string, string> = {
  "/products": "/parts",
  "/quality-control": "/sourcing-services",
};

export function getLocaleFromPathname(pathname: string): Locale | null {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : null;
}

export function stripLocaleFromPathname(pathname: string) {
  const locale = getLocaleFromPathname(pathname);
  if (!locale) return pathname || "/";

  const stripped = pathname.slice(locale.length + 1);
  return stripped || "/";
}

export function localizeHref(
  locale: Locale,
  href: string,
  fallbackLocale: Locale = defaultLocale,
) {
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("http://") ||
    href.startsWith("https://")
  ) {
    return href;
  }

  const [pathAndQuery, hash = ""] = href.split("#", 2);
  const [pathname, query = ""] = pathAndQuery.split("?", 2);
  const currentLocale = getLocaleFromPathname(pathname);
  const pathWithoutLocale = currentLocale
    ? stripLocaleFromPathname(pathname)
    : pathname;
  const mappedPath = legacyPathMap[pathWithoutLocale] ?? pathWithoutLocale;
  const resolvedLocale = locale ?? fallbackLocale;
  const normalizedPath = mappedPath === "/" ? "" : mappedPath;

  return `/${resolvedLocale}${normalizedPath}${query ? `?${query}` : ""}${
    hash ? `#${hash}` : ""
  }`;
}

export function switchLocalePathname(pathname: string, locale: Locale) {
  const pathWithoutLocale = stripLocaleFromPathname(pathname);
  return localizeHref(locale, pathWithoutLocale);
}
