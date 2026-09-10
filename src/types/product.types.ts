interface ITheme {
  from: string;
  via: string;
  to: string;
  glow1: string;
  glow2: string;
}

export interface IProductSolutionItem {
  text: string;
}

export interface IProductSolutionSection {
  badge?: string;
  title: string;
  description?: string;
  media: {
    type: "video" | "image";
    src: string;
    alt?: string;
    videoSrc?: string;
  };
  listTitle: string;
  items: IProductSolutionItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

export interface IPricingPlan {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  currency: string;
  billingPeriod: "MONTHLY" | "QUARTERLY" | "YEARLY" | "ONE_TIME";
  features: string[];
  isPopular: boolean;
  seats?: number | null;
  projectName?: string | null;
  projectSlug?: string | null;
}

export interface IProjectBrief {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  status: "PLANNING" | "ACTIVE" | "ON_HOLD" | "DONE" | "ARCHIVED";
  dueDate?: string | null;
  organizationName?: string | null;
  organizationSlug?: string | null;
}

export interface IProduct {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  badge: string;
  description?: string | null;
  featured?: boolean;
  isFree?: boolean;
  theme: ITheme;
  solutionSection?: IProductSolutionSection | null;
  pricingPlans?: IPricingPlan[];
}
