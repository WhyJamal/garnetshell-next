"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOtpCode, getOtpExpiry, isOtpExpired } from "@/lib/otp";
import { sendVerificationEmail } from "@lib/mailer";

type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function verifyEmailAction(code: string): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Не авторизован" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      emailVerified: true,
      verificationCode: true,
      verificationCodeExpiry: true,
    },
  });

  if (!user) {
    return { success: false, error: "Пользователь не найден" };
  }

  if (user.emailVerified) {
    return { success: true };
  }

  if (!user.verificationCode || user.verificationCode !== code) {
    return { success: false, error: "Неверный код" };
  }

  if (isOtpExpired(user.verificationCodeExpiry)) {
    return { success: false, error: "Срок действия кода истёк, запросите новый" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      emailVerified: true,
      verificationCode: null,
      verificationCodeExpiry: null,
    },
  });

  return { success: true };
}

export async function resendVerificationCodeAction(): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Не авторизован" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, emailVerified: true },
  });

  if (!user) {
    return { success: false, error: "Пользователь не найден" };
  }

  if (user.emailVerified) {
    return { success: true };
  }

  const code = generateOtpCode();

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      verificationCode: code,
      verificationCodeExpiry: getOtpExpiry(),
    },
  });

  await sendVerificationEmail(user.email, code);

  return { success: true };
}
