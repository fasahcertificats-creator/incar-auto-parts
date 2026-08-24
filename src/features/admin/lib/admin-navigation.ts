export type AdminNavStatus = "active" | "coming-soon";

export interface AdminNavItem {
  key: string;
  label: string;
  href: string;
  status: AdminNavStatus;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { key: "requests", label: "Requests", href: "/admin/requests", status: "active" },
  { key: "quotes", label: "Quotes", href: "/admin/quotes", status: "active" },
  { key: "customers", label: "Customers", href: "/admin/customers", status: "active" },
  { key: "products", label: "Products", href: "/admin/products", status: "active" },
  { key: "categories", label: "Categories", href: "/admin/categories", status: "active" },
  { key: "vehicles", label: "Vehicles", href: "/admin/vehicles", status: "active" },
  { key: "analytics", label: "Analytics", href: "/admin/analytics", status: "coming-soon" },
];
