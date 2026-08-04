const localFallback = "http://localhost:3000";

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredUrl) {
    return new URL(localFallback);
  }

  try {
    const url = new URL(configuredUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return new URL(localFallback);
    }

    url.pathname = url.pathname.replace(/\/$/, "");
    return url;
  } catch {
    return new URL(localFallback);
  }
}

export function absoluteSiteUrl(pathname: string) {
  return new URL(pathname, getSiteUrl()).toString();
}
