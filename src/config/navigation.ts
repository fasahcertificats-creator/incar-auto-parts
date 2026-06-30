export type NavigationItem = {
  key:
    | "home"
    | "products"
    | "catalogs"
    | "private-label"
    | "quality-control"
    | "about"
    | "rfq"
    | "contact";
  href: string;
};

export const mainNavigation: NavigationItem[] = [
  { key: "home", href: "/" },
  { key: "products", href: "/products" },
  { key: "catalogs", href: "/catalogs" },
  { key: "private-label", href: "/private-label" },
  { key: "quality-control", href: "/quality-control" },
  { key: "about", href: "/about" },
  { key: "rfq", href: "/rfq" },
  { key: "contact", href: "/contact" },
];

export const footerNavigation = mainNavigation.filter(
  (item) => item.key !== "home",
);

export const footerCapabilityKeys = [
  "china-sourcing",
  "quality-inspection",
  "private-label",
  "export-support",
] as const;
