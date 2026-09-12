"use server";

import { prisma } from "@/lib/prisma";
import { generateOtpCode, getOtpExpiry } from "@/lib/otp";
import { sendPasswordResetEmail } from "@lib/mailer";

type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function requestPasswordResetAction(email: string): Promise<ActionResult> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });

  if (user) {
    const code = generateOtpCode();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetCode: code,
        resetCodeExpiry: getOtpExpiry(),
      },
    });

    await sendPasswordResetEmail(user.email, code);
  }

  return { success: true };
}
