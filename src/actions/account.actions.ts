"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { PAGES } from "@/config/pages.config";
import type {
  AccountWorkspace,
  OrganizationWorkspace,
  ProductCatalogItem,
} from "@/types/account.types";
import {
  normalizeText,
  normalizeDate,
  normalizeNumber,
  getUniqueSlug,
  requireUser,
} from "@/utils/account.utils";

const ACCOUNT_ROOT = PAGES.ACCOUNT;

export async function getCurrentOrganization(userId: string): Promise<OrganizationWorkspace | null> {
  return prisma.organization.findFirst({
    where: {
      OR: [{ ownerId: userId }, { members: { some: { userId } } }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      members: {
        orderBy: [{ joinedAt: "asc" }],
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
              appSsoUrl: true,
            },
          },
        },
      },
      projects: {
        orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
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
    },
  }) as Promise<OrganizationWorkspace | null>;
}

async function getAvailableProducts(): Promise<ProductCatalogItem[]> {
  return prisma.product.findMany({
    orderBy: [{ featured: "desc" }, { title: "asc" }],
    include: {
      pricingPlans: {
        orderBy: [{ isPopular: "desc" }, { price: "asc" }],
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
    },
  }) as Promise<ProductCatalogItem[]>;
}

export async function getAccountWorkspaceAction(): Promise<AccountWorkspace> {
  const user = await requireUser();
  const [organization, availableProducts] = await Promise.all([
    getCurrentOrganization(user.id),
    getAvailableProducts(),
  ]);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.profile?.bio ?? null,
    },
    organization,
    availableProducts,
  };
}

export async function updateProfileAction(formData: FormData) {
  const user = await requireUser();

  const name = normalizeText(formData.get("name"));
  const bio = normalizeText(formData.get("bio"));

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || null,
      },
    }),
    prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        bio: bio || "",
      },
      create: {
        userId: user.id,
        bio: bio || "",
      },
    }),
  ]);

  revalidatePath(ACCOUNT_ROOT);
}

export async function changePasswordAction(formData: FormData) {
  const user = await requireUser();

  const currentPassword = normalizeText(formData.get("currentPassword"));
  const newPassword = normalizeText(formData.get("newPassword"));
  const confirmPassword = normalizeText(formData.get("confirmPassword"));

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error("Заполните все поля");
  }

  if (newPassword.length < 8) {
    throw new Error("Новый пароль должен быть не короче 8 символов");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Пароли не совпадают");
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    throw new Error("Текущий пароль неверный");
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
    },
  });

  revalidatePath(`${ACCOUNT_ROOT}/security`);
}

export async function deleteProjectAction(formData: FormData) {
  const user = await requireUser();
  const organization = await getCurrentOrganization(user.id);

  if (!organization) {
    throw new Error("Организация не найдена");
  }

  const projectId = normalizeText(formData.get("projectId"));

  if (!projectId) {
    throw new Error("Проект не найден");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, organizationId: true },
  });

  if (!project || project.organizationId !== organization.id) {
    throw new Error("Недостаточно прав");
  }

  await prisma.project.delete({
    where: { id: project.id },
  });

  revalidatePath(`${ACCOUNT_ROOT}/projects`);
  revalidatePath(ACCOUNT_ROOT);
}