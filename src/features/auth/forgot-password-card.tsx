"use client";

import { AuthFieldRow } from "@components/auth/auth-field-row";
import { ArrowActionButton } from "@components/auth/arrow-action-button";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/use-form";
import { forgotPasswordSchema } from "@/schema/forgot-password-schema";
import { requestPasswordResetAction } from "@actions/forgot-password.action";
import { useRouter } from "next/navigation";
import { PAGES } from "@config/pages.config";
import Link from "next/link";

export default function ForgotPasswordCard() {
  const router = useRouter();

  const {
    values: form,
    errors,
    loading,
    handleChange,
    handleSubmit,
  } = useForm({
    initialValues: { email: "" },
    schema: forgotPasswordSchema,
    onSubmit: async (data) => {
      await requestPasswordResetAction(data.email);
      router.push(`${PAGES.RESET_PASSWORD}?email=${encodeURIComponent(data.email)}`);
    },
  });

  return (
    <div className="w-full max-w-105">
      <p className="mb-7 text-center text-[18px] leading-7 text-neutral-700 dark:text-white/70">
        Введите email — мы отправим код для сброса пароля.
      </p>

      <div className="overflow-hidden rounded-2xl border border-neutral-300 bg-white shadow-sm dark:border-white/10 dark:bg-[#111418]">
        <AuthFieldRow
          label="Email"
          type="email"
          name="email"
          value={form.email}
          error={errors.email}
          onChange={handleChange}
          placeholder="Введите email"
          containerClassName="relative px-5 py-3 pr-14 border-neutral-200 bg-white dark:border-white/10 dark:bg-[#111418]"
        >
          {form.email && (
            <ArrowActionButton
              onClick={handleSubmit}
              loading={loading}
              className="absolute right-4 top-6 h-11 w-11 rounded-full border-2 border-neutral-400 bg-transparent hover:bg-white/40 dark:border-white/30 dark:hover:bg-white/10"
            />
          )}
        </AuthFieldRow>
      </div>

      <div className="mt-7 text-center">
        <Button variant="link" asChild className="p-0 text-[17px] text-blue-600 dark:text-blue-400">
          <Link href={PAGES.SIGN_IN}>Вернуться ко входу</Link>
        </Button>
      </div>
    </div>
  );
}
