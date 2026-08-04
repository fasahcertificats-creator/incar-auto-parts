export type NavigationItem = {
  key:
    | "home"
    | "parts"
    | "catalogs"
    | "private-label"
    | "sourcing-services"
    | "about"
    | "contact";
  href: string;
};

export const mainNavigation: NavigationItem[] = [
  { key: "parts", href: "/parts" },
  { key: "catalogs", href: "/catalogs" },
  { key: "sourcing-services", href: "/sourcing-services" },
  { key: "private-label", href: "/private-label" },
  { key: "about", href: "/about" },
];

export const footerNavigation: NavigationItem[] = [
  ...mainNavigation,
  { key: "contact", href: "/contact" },
];

export const footerCapabilityKeys = [
  "china-sourcing",
  "quality-inspection",
  "private-label",
  "export-support",
] as const;
