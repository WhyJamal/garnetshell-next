"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
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
  const requestId = normalizeText(formData.get("requestId"));

  if (!productId) {
    throw new Error("Mahsulot tanlanmagan");
  }

  if (requestId) {
    const existing = await prisma.project.findUnique({
      where: { requestId },
      select: { id: true },
    });
    if (existing) {
      redirect(`${PAGES.ACCOUNT_PROJECTS}?purchased=1`);
    }
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

  const recentDuplicate = await prisma.project.findFirst({
    where: {
      organizationId: organization.id,
      productId: product.id,
      pricingPlanId: plan?.id ?? null,
      createdAt: { gte: new Date(Date.now() - 15_000) }, // oxirgi 15 soniya
    },
    select: { id: true },
  });

  if (recentDuplicate) {
    redirect(`${PAGES.ACCOUNT_PROJECTS}?purchased=1`);
  }

  let project;
  try {
    project = await prisma.project.create({
      data: {
        organizationId: organization.id,
        productId: product.id,
        pricingPlanId: plan?.id ?? null,
        name: projectName,
        status: "ACTIVE",
        slug,
        startsAt: new Date(),
        endsAt,
        requestId: requestId || null,
      },
    });
  } catch (e) {
    if ((e as { code?: string })?.code === "P2002") {
      redirect(`${PAGES.ACCOUNT_PROJECTS}?purchased=1`);
    }
    throw e;
  }

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
        signal: AbortSignal.timeout(10_000),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("[purchaseProductAction] provision response:", {
          organizationId: data.organizationId,
          userId: data.userId,
          loginEmail: data.loginEmail,
          hasLoginPassword: Boolean(data.loginPassword),
          alreadyExisted: data.alreadyExisted,
        });
        await prisma.project.update({
          where: { id: project.id },
          data: {
            externalOrgId: data.organizationId ?? null,
            externalUserId: data.userId ?? null,
            provisionedAt: new Date(),
          },
        });

        // imart-next haqiqiy email bilan YANGI User yaratgan bo'lsa
        // (ya'ni bu odam u yerda ilk marta paydo bo'lsa), parolni bir
        // martalik, qisqa muddatli cookie orqali ko'rsatamiz — bazaga
        // saqlanmaydi, faqat keyingi sahifa yuklanishida o'qib
        // ko'rsatiladi va o'zi 60 soniyada eskiradi. Mavjud userga
        // yangi tashkilot qo'shilgan bo'lsa (loginPassword yo'q) —
        // hech narsa ko'rsatilmaydi, chunki u parolini allaqachon biladi.
        if (data.loginPassword && data.loginEmail) {
          const cookieStore = await cookies();
          cookieStore.set(
            "vm_login_hint",
            JSON.stringify({
              email: data.loginEmail,
              password: data.loginPassword,
            }),
            {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
              maxAge: 60,
            }
          );
        }
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

  // MUHIM: bu yerda ataylab getCurrentOrganization() (faqat ENG
  // SO'NGGI tashkilot) ishlatilmaydi — aks holda foydalanuvchi bir
  // xil productni bir necha marta sotib olgan bo'lsa, ESKI
  // tashkilotdagi loyihaga "Kirish" bosganda "Bu loyiha uchun kirish
  // mavjud emas" xatosi chiqardi. O'rniga — shu projectId haqiqatan
  // ham shu userga tegishli biror tashkilotniki ekanligi to'g'ridan
  // tekshiriladi.
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organization: {
        OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
      },
    },
    select: {
      externalUserId: true,
      externalOrgId: true,
      product: { select: { appSsoUrl: true } },
    },
  });

  if (!project?.externalUserId || !project.product.appSsoUrl) {
    throw new Error("Bu loyiha uchun kirish mavjud emas");
  }

  const token = signIntegrationToken({
    userId: project.externalUserId,
    organizationId: project.externalOrgId,
  });
  redirect(`${project.product.appSsoUrl}?token=${encodeURIComponent(token)}`);
}