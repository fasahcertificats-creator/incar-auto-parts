export type PageGoalKey =
  | "home"
  | "products"
  | "productDetails"
  | "catalogs"
  | "privateLabel"
  | "qualityControl"
  | "about"
  | "rfq"
  | "contact";

export type PageConversionGoal = {
  page: string;
  primaryGoal: string;
  primaryCTA: string;
};

export const pageGoals: Record<PageGoalKey, PageConversionGoal> = {
  home: {
    page: "Home",
    primaryGoal: "Request Quotation",
    primaryCTA: "Request Quotation",
  },
  products: {
    page: "Products",
    primaryGoal: "Add to RFQ",
    primaryCTA: "Add to RFQ",
  },
  productDetails: {
    page: "Product Details",
    primaryGoal: "Add to RFQ",
    primaryCTA: "Add to RFQ",
  },
  catalogs: {
    page: "Catalogs",
    primaryGoal: "Request Catalog",
    primaryCTA: "Request Catalog",
  },
  privateLabel: {
    page: "Private Label",
    primaryGoal: "Start Private Label Inquiry",
    primaryCTA: "Start Private Label Inquiry",
  },
  qualityControl: {
    page: "Quality Control",
    primaryGoal: "Build Trust / Request Quotation",
    primaryCTA: "Request Quotation",
  },
  about: {
    page: "About",
    primaryGoal: "Speak With INCAR",
    primaryCTA: "Speak With INCAR",
  },
  rfq: {
    page: "RFQ",
    primaryGoal: "Submit RFQ",
    primaryCTA: "Submit RFQ",
  },
  contact: {
    page: "Contact",
    primaryGoal: "Contact via WhatsApp",
    primaryCTA: "Contact via WhatsApp",
  },
};
