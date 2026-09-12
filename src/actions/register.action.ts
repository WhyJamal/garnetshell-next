"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { generateOtpCode, getOtpExpiry } from "@/lib/otp";
import { sendVerificationEmail } from "@lib/mailer";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function registerAction(data: RegisterInput): Promise<ActionResult> {
  const { name, email, password, confirmPassword } = data;

  if (password !== confirmPassword) {
    return { success: false, error: "Пароли не совпадают" };
  }

  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    return { success: false, error: "Этот email уже зарегистрирован" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const code = generateOtpCode();

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      emailVerified: false,
      verificationCode: code,
      verificationCodeExpiry: getOtpExpiry(),
    },
  });

  await sendVerificationEmail(email, code);

  return { success: true };
}
