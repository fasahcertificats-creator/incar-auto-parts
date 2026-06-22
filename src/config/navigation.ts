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
  label: string;
  href: string;
  arLabel: string;
};

export const mainNavigation: NavigationItem[] = [
  { key: "home", label: "Home", href: "/", arLabel: "الرئيسية" },
  { key: "products", label: "Products", href: "/products", arLabel: "المنتجات" },
  { key: "catalogs", label: "Catalogs", href: "/catalogs", arLabel: "الكتالوجات" },
  {
    key: "private-label",
    label: "Private Label",
    href: "/private-label",
    arLabel: "العلامة الخاصة",
  },
  {
    key: "quality-control",
    label: "Quality Control",
    href: "/quality-control",
    arLabel: "مراقبة الجودة",
  },
  { key: "about", label: "About", href: "/about", arLabel: "من نحن" },
  { key: "rfq", label: "RFQ", href: "/rfq", arLabel: "طلب عرض سعر" },
  { key: "contact", label: "Contact", href: "/contact", arLabel: "اتصل بنا" },
];

export const footerNavigation = mainNavigation.filter(
  (item) => item.key !== "home",
);

export const footerCapabilities = [
  "China Sourcing",
  "Quality Inspection",
  "Private Label",
  "Export Support",
];
