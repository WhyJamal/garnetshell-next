import type { Prisma } from "@/generated/prisma/client";

export const productCatalogInclude = {
  pricingPlans: {
    orderBy: [
      { isPopular: "desc" as Prisma.SortOrder },
      { price: "asc" as Prisma.SortOrder },
    ],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      currency: true,
      billingPeriod: true,
      isPopular: true,
      seats: true,
      productId: true,
      features: true,
    },
  },
} satisfies Prisma.ProductInclude;

export const organizationWorkspaceInclude = {
  owner: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },

  members: {
    orderBy: [
      { joinedAt: "asc" as Prisma.SortOrder },
    ],
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },

  products: {
    include: {
      product: {
        select: {
          id: true,
          slug: true,
          title: true,
          subtitle: true,
          badge: true,
          image: true,
          imageAlt: true,
          featured: true,
          },
      },
    },
  },

  projects: {
    orderBy: [
      { dueDate: "asc" as Prisma.SortOrder },
      { createdAt: "asc" as Prisma.SortOrder },
    ],
    include: {
      product: {
        select: {
          id: true,
          slug: true,
          title: true,
          subtitle: true,
          badge: true,
          image: true,
          imageAlt: true,
          featured: true,
          appSsoUrl: true,
        },
      },

      pricingPlan: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          currency: true,
          billingPeriod: true,
          isPopular: true,
          seats: true,
        },
      },
    },
  },
} satisfies Prisma.OrganizationInclude;

export type ProductCatalogItem = Prisma.ProductGetPayload<{
  include: typeof productCatalogInclude;
}>;

export type OrganizationWorkspace = Prisma.OrganizationGetPayload<{
  include: typeof organizationWorkspaceInclude;
}>;

export type WorkspaceMember =
  OrganizationWorkspace["members"][number];

export type WorkspaceProject =
  OrganizationWorkspace["projects"][number];

export type WorkspaceLinkedProduct =
  OrganizationWorkspace["products"][number];

export type AccountWorkspace = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    bio: string | null;
  };
  organization: OrganizationWorkspace | null;
  availableProducts: ProductCatalogItem[];
};