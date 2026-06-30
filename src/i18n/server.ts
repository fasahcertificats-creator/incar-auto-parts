import { cookies } from "next/headers";
import { defaultLocale, isLocale, localeCookieName } from "./config";
import { getDictionary } from "./dictionaries";
import type { Locale } from "./types";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(localeCookieName)?.value;
  return isLocale(locale) ? locale : defaultLocale;
}

export async function getServerDictionary() {
  return getDictionary(await getServerLocale());
}
