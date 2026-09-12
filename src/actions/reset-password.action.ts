"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { isOtpExpired } from "@/lib/otp";

type ResetPasswordInput = {
  email: string;
  code: string;
  password: string;
};

type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function resetPasswordAction(data: ResetPasswordInput): Promise<ActionResult> {
  const { email, code, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, resetCode: true, resetCodeExpiry: true },
  });

  if (!user || !user.resetCode || user.resetCode !== code) {
    return { success: false, error: "Неверный код" };
  }

  if (isOtpExpired(user.resetCodeExpiry)) {
    return { success: false, error: "Срок действия кода истёк, запросите новый" };
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      resetCode: null,
      resetCodeExpiry: null,
    },
  });

  return { success: true };
}
