import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [header, mobileMenu, languageSwitcher, arabic, english] = await Promise.all([
  readFile(new URL("../src/components/Header.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/components/layout/MobileMenu.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/components/LanguageSwitcher.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/i18n/dictionaries/ar.ts", import.meta.url), "utf8"),
  readFile(new URL("../src/i18n/dictionaries/en.ts", import.meta.url), "utf8"),
]);

test("uses the approved Arabic and English mobile labels", () => {
  assert.match(arabic, /mobileRfq: "طلب عرض"/u);
  assert.match(arabic, /closeMenu: "إغلاق القائمة"/u);
  assert.match(english, /mobileRfq: "RFQ"/u);
  assert.match(english, /closeMenu: "Close menu"/u);
});

test("keeps search on desktop and removes it from the mobile header", () => {
  const mobileHeader = header.slice(
    header.indexOf('grid-cols-[1fr_auto_1fr]'),
    header.indexOf('className="mx-auto hidden max-w-[94rem]'),
  );
  assert.ok(!mobileHeader.includes("HeaderSearch"));
  assert.match(header, /<HeaderSearch \/>/u);
  assert.ok(!header.includes("<HeaderSearch compact"));
});

test("renders an 85 percent localized viewport drawer through a portal", () => {
  assert.match(mobileMenu, /w-\[85vw\]/u);
  assert.match(mobileMenu, /direction === "rtl"/u);
  assert.match(mobileMenu, /right-0 border-l/u);
  assert.match(mobileMenu, /left-0 border-r/u);
  assert.match(mobileMenu, /translate-x-full/u);
  assert.match(mobileMenu, /-translate-x-full/u);
  assert.match(mobileMenu, /createPortal\(drawer, document\.body\)/u);
  assert.ok(!mobileMenu.includes("dictionary.navigation.search"));
});

test("provides backdrop, scroll, close, active-route, and dialog contracts", () => {
  assert.match(mobileMenu, /aria-modal="true"/u);
  assert.match(mobileMenu, /aria-expanded=\{open\}/u);
  assert.match(mobileMenu, /bg-black\/70/u);
  assert.match(mobileMenu, /overflow-y-auto/u);
  assert.match(mobileMenu, /bodyStyle\.position = "fixed"/u);
  assert.match(mobileMenu, /event\.key === "Escape"/u);
  assert.match(mobileMenu, /aria-current=\{active \? "page" : undefined\}/u);
  assert.match(mobileMenu, /onClick=\{closeMenu\}/u);
  assert.match(mobileMenu, /matchMedia\("\(min-width: 1024px\)"\)/u);
});

test("traps focus and closes before the locale navigation", () => {
  assert.match(mobileMenu, /FOCUSABLE_SELECTOR/u);
  assert.match(mobileMenu, /last\.focus\(\)/u);
  assert.match(mobileMenu, /first\.focus\(\)/u);
  assert.match(mobileMenu, /triggerRef\.current\?\.focus\(\)/u);
  assert.match(mobileMenu, /<LanguageSwitcher fullWidth onSelect=\{closeMenu\} \/>/u);
  assert.match(languageSwitcher, /onSelect\?\.\(\)/u);
});

test("keeps the polished drawer compact and touch safe", () => {
  assert.match(mobileMenu, /min-h-16 items-center justify-between/u);
  assert.match(mobileMenu, /min-h-\[52px\]/u);
  assert.match(mobileMenu, /text-base leading-6/u);
  assert.match(mobileMenu, /border-metallic-silver\/\[0\.08\]/u);
  assert.match(mobileMenu, /focus-visible:ring-primary\/20/u);
  assert.match(mobileMenu, /safe-area-inset-bottom/u);
  assert.match(languageSwitcher, /min-h-11 flex-1/u);
});
