"use server"

import { getUniqueSlug, normalizeText, requireUser } from "@/utils/account.utils";
import { getCurrentOrganization } from "@/actions/account.actions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PAGES } from "@/config/pages.config";

const ACCOUNT_ROOT = PAGES.ACCOUNT;

export type OrganizationActionState = {
  success: boolean;
  message?: string;
};

// Eslatma: getCurrentOrganization() shu faylning yuqorisida
// "@/actions/account.actions"'dan import qilinadi — bu yerda avval
// bir xil nomli lokal funksiya ham bor edi (import bilan to'qnashib,
// uni soyada qoldirar edi). O'chirildi, endi faqat import ishlatiladi.

export async function createOrganizationAction(
  _prevState: OrganizationActionState,
  formData: FormData,
): Promise<OrganizationActionState> {
  const user = await requireUser();

  const existing = await getCurrentOrganization(user.id);
  if (existing) {
    return {
      success: false,
      message: "У вас уже есть организация",
    };
  }

  const name = normalizeText(formData.get("name"));
  const inn = normalizeText(formData.get("inn"));
  const description = normalizeText(formData.get("description"));
  const logo = normalizeText(formData.get("logo"));
  const productId = normalizeText(formData.get("productId"));

  if (!name) {
    return {
      success: false,
      message: "Введите название организации",
    };
  }

  if (inn) {
    const existingInn = await prisma.organization.findUnique({
      where: { inn },
      select: { id: true },
    });

    if (existingInn) {
      return {
        success: false,
        message: "Организация с таким ИНН уже существует",
      };
    }
  }

  const slug = await getUniqueSlug(name, async (candidate) => {
    const row = await prisma.organization.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    return Boolean(row);
  });

  await prisma.organization.create({
    data: {
      name,
      slug,
      inn: inn || null,
      description: description || null,
      logo: logo || null,
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
      ...(productId
        ? {
          products: {
            create: {
              productId,
            },
          },
        }
        : {}),
    },
  });

  revalidatePath(ACCOUNT_ROOT);
  revalidatePath(`${ACCOUNT_ROOT}/organization`);

  return {
    success: true,
  };
}

export async function updateOrganizationAction(formData: FormData) {
  const user = await requireUser();

  const organizationId = normalizeText(formData.get("organizationId"));
  const name = normalizeText(formData.get("name"));
  const slugInput = normalizeText(formData.get("slug"));
  const description = normalizeText(formData.get("description"));
  const logo = normalizeText(formData.get("logo"));

  if (!organizationId) {
    throw new Error("Организация не найдена");
  }

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true, ownerId: true, slug: true },
  });

  if (!organization) {
    throw new Error("Организация не найдена");
  }

  if (organization.ownerId !== user.id) {
    throw new Error("Недостаточно прав");
  }

  const nextSlug = slugInput || organization.slug;
  const slug =
    nextSlug === organization.slug
      ? organization.slug
      : await getUniqueSlug(nextSlug, async (candidate) => {
        const row = await prisma.organization.findUnique({
          where: { slug: candidate },
          select: { id: true },
        });
        return Boolean(row) && row.id !== organization.id;
      });

  await prisma.organization.update({
    where: { id: organization.id },
    data: {
      name: name || undefined,
      slug,
      description: description || null,
      logo: logo || null,
    },
  });

  revalidatePath(ACCOUNT_ROOT);
  revalidatePath(`${ACCOUNT_ROOT}/organization`);
}
