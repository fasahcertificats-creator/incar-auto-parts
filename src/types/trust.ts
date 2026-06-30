export type TrustCTA = {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "ghost";
};

export type TrustPillar = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  highlights: string[];
  proofPoints: string[];
  relatedCTA: TrustCTA;
  pageUsage: string[];
};

export type TrustProcessStep = {
  id: string;
  title: string;
  description: string;
  order: number;
};
