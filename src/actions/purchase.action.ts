"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PAGES } from "@/config/pages.config";
import { getCurrentOrganization } from "@/actions/account.actions";
import { normalizeText, getUniqueSlug, requireUser } from "@/utils/account.utils";
import { getServerAuthHeader, signIntegrationToken } from "@/lib/integration";

function computeEndsAt(billingPeriod: string, from: Date): Date | null {
  const d = new Date(from);
  switch (billingPeriod) {
    case "MONTHLY":
      d.setMonth(d.getMonth() + 1);
      return d;
    case "QUARTERLY":
      d.setMonth(d.getMonth() + 3);
      return d;
    case "YEARLY":
      d.setFullYear(d.getFullYear() + 1);
      return d;
    default:
      return null; // ONE_TIME — muddatsiz
  }
}

/**
 * Pricing/Product sahifasidagi "Tarifni tanlash" tugmasi shu action'ga
 * ulanadi. Har bir xarid — HAR DOIM yangi `Project` yaratadi (bir odam
 * bir xil mahsulotni bir necha marta — masalan bir necha do'kon uchun —
 * sotib olishi mumkin, shuning uchun dublikat tekshiruvi yo'q).
 *
 * Agar mahsulot (masalan Vol-mart) tashqi ilovada avtomatik tashkilot
 * ochib berishni talab qilsa (`Product.appProvisionUrl` to'ldirilgan
 * bo'lsa) — xariddan so'ng o'sha ilovaga so'rov yuborilib, natijasi
 * (externalOrgId/externalUserId) shu Project'ga saqlanadi.
 */
export async function purchaseProductAction(formData: FormData) {
  const user = await requireUser();

  const productId = normalizeText(formData.get("productId"));
  const pricingPlanId = normalizeText(formData.get("pricingPlanId"));
  const shopName = normalizeText(formData.get("organizationName"));

  if (!productId) {
    throw new Error("Mahsulot tanlanmagan");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      title: true,
      isFree: true,
      appProvisionUrl: true,
      appSsoUrl: true,
    },
  });
  if (!product) {
    throw new Error("Mahsulot topilmadi");
  }

  let plan: {
    id: string;
    productId: string;
    name: string;
    billingPeriod: string;
  } | null = null;

  if (pricingPlanId) {
    plan = await prisma.pricingPlan.findUnique({
      where: { id: pricingPlanId },
      select: { id: true, productId: true, name: true, billingPeriod: true },
    });
    if (!plan || plan.productId !== productId) {
      throw new Error("Tanlangan tarif bu mahsulotga tegishli emas");
    }
  }

  let organization = await getCurrentOrganization(user.id);

  if (!organization) {
    const baseName = user.name?.trim() || user.email.split("@")[0];
    const orgName = `${baseName} — ishchi maydon`;
    const slug = await getUniqueSlug(orgName, async (candidate) => {
      const row = await prisma.organization.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });
      return Boolean(row);
    });

    await prisma.organization.create({
      data: {
        name: orgName,
        slug,
        ownerId: user.id,
        members: {
          create: { userId: user.id, role: "OWNER" },
        },
      },
    });

    organization = await getCurrentOrganization(user.id);
  }

  if (!organization) {
    throw new Error("Tashkilot yaratib bo'lmadi");
  }

  await prisma.organizationProduct.upsert({
    where: {
      organizationId_productId: {
        organizationId: organization.id,
        productId: product.id,
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      productId: product.id,
    },
  });

  const projectName =
    shopName || (plan ? `${product.title} — ${plan.name}` : product.title);

  const slug = await getUniqueSlug(projectName, async (candidate) => {
    const row = await prisma.project.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    return Boolean(row);
  });

  // Bepul mahsulotda muddat yo'q — hozircha to'lov tizimi ulanmagan,
  // shuning uchun pullik rejalar bo'yicha ham muddatni faqat rejaning
  // o'zi belgilagan davr asosida hisoblab qo'yamiz (to'lov integratsiyasi
  // qo'shilganda shu joy yangilanadi).
  const endsAt = product.isFree
    ? null
    : plan
      ? computeEndsAt(plan.billingPeriod, new Date())
      : null;

  const project = await prisma.project.create({
    data: {
      organizationId: organization.id,
      productId: product.id,
      pricingPlanId: plan?.id ?? null,
      name: projectName,
      status: "ACTIVE",
      slug,
      startsAt: new Date(),
      endsAt,
    },
  });

  // Tashqi ilovaga (masalan Vol-mart) avtomatik tashkilot ochib berish
  if (product.appProvisionUrl) {
    try {
      const res = await fetch(product.appProvisionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getServerAuthHeader(),
        },
        body: JSON.stringify({
          saasProjectId: project.id,
          saasUserId: user.id,
          organizationName: projectName,
          ownerName: user.name ?? "",
          ownerEmail: user.email,
          expiresAt: endsAt?.toISOString() ?? null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        await prisma.project.update({
          where: { id: project.id },
          data: {
            externalOrgId: data.organizationId ?? null,
            externalUserId: data.userId ?? null,
            provisionedAt: new Date(),
          },
        });
      } else {
        console.error("[purchaseProductAction] provision failed", await res.text());
      }
    } catch (err) {
      // Tashqi ilova vaqtincha ishlamasa ham, xarid o'zi saqlanib qoladi —
      // foydalanuvchi keyinroq "Kirish" bosganda qayta urinib ko'rish mumkin.
      console.error("[purchaseProductAction] provision request error", err);
    }
  }

  revalidatePath(PAGES.ACCOUNT);
  revalidatePath(PAGES.ACCOUNT_PROJECTS);
  revalidatePath(PAGES.ACCOUNT_ORGANIZATION);

  redirect(`${PAGES.ACCOUNT_PROJECTS}?purchased=1`);
}

/**
 * "Kirish" tugmasi shu action'ni chaqiradi — token yaratib, foydalanuvchini
 * to'g'ridan-to'g'ri (parolsiz) tashqi ilovaga (masalan Vol-mart) kiritadi.
 */
export async function enterExternalAppAction(formData: FormData) {
  const user = await requireUser();
  const projectId = normalizeText(formData.get("projectId"));
  if (!projectId) throw new Error("Loyiha tanlanmagan");

  const organization = await getCurrentOrganization(user.id);
  if (!organization) throw new Error("Tashkilot topilmadi");

  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId: organization.id },
    select: {
      externalUserId: true,
      product: { select: { appSsoUrl: true } },
    },
  });

  if (!project?.externalUserId || !project.product.appSsoUrl) {
    throw new Error("Bu loyiha uchun kirish mavjud emas");
  }

  const token = signIntegrationToken({ userId: project.externalUserId });
  redirect(`${project.product.appSsoUrl}?token=${encodeURIComponent(token)}`);
}
