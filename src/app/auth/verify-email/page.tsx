import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PAGES } from "@/config/pages.config";
import VerifyEmailCard from "@/features/auth/verify-email-card";

export default async function VerifyEmailPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(PAGES.SIGN_IN);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, emailVerified: true },
  });

  if (!user) {
    redirect(PAGES.SIGN_IN);
  }

  if (user.emailVerified) {
    redirect(PAGES.ACCOUNT);
  }

  return <VerifyEmailCard email={user.email} />;
}
