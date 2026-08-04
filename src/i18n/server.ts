import { cookies, headers } from "next/headers";
import { defaultLocale, isLocale, localeCookieName } from "./config";
import { getDictionary } from "./dictionaries";
import type { Locale } from "./types";

export async function getServerLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  const routeLocale = requestHeaders.get("x-incar-locale");

  if (isLocale(routeLocale)) {
    return routeLocale;
  }

  const cookieStore = await cookies();
  const locale = cookieStore.get(localeCookieName)?.value;
  return isLocale(locale) ? locale : defaultLocale;
}

export async function getServerDictionary() {
  return getDictionary(await getServerLocale());
}
