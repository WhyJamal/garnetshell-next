import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { slugifyText } from "@/lib/slug";
import { PAGES } from "@/config/pages.config";

const LOGIN_ROUTE = PAGES.SIGN_IN;

export function normalizeText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export function normalizeDate(value: FormDataEntryValue | null) {
  const raw = normalizeText(value);
  return raw ? new Date(raw) : null;
}

export function normalizeNumber(value: FormDataEntryValue | null) {
  const raw = normalizeText(value);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function getUniqueSlug(
  baseValue: string,
  exists: (slug: string) => Promise<boolean>,
) {
  const base = slugifyText(baseValue);
  let slug = base;
  let counter = 2;

  while (await exists(slug)) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}

export async function requireUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(LOGIN_ROUTE);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      emailVerified: true,
      profile: {
        select: {
          bio: true,
        },
      },
    },
  });

  if (!user) {
    redirect(LOGIN_ROUTE);
  }

  if (!user.emailVerified) {
    redirect(PAGES.VERIFY_EMAIL);
  }

  return user;
}