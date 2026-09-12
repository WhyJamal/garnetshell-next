"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthFieldRow } from "@components/auth/auth-field-row";
import { ArrowActionButton } from "@components/auth/arrow-action-button";
import { useForm } from "@/hooks/use-form";
import { resetPasswordSchema } from "@/schema/reset-password-schema";
import { resetPasswordAction } from "@actions/reset-password.action";
import { PAGES } from "@config/pages.config";

export default function ResetPasswordCard() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";
  const [formError, setFormError] = useState("");

  const {
    values: form,
    errors,
    loading,
    handleChange,
    handleSubmit,
  } = useForm({
    initialValues: {
      email: emailFromQuery,
      code: "",
      password: "",
      confirmPassword: "",
    },
    schema: resetPasswordSchema,
    onSubmit: async (data) => {
      setFormError("");

      const result = await resetPasswordAction({
        email: data.email,
        code: data.code,
        password: data.password,
      });

      if (!result.success) {
        setFormError(result.error);
        return;
      }

      router.push(PAGES.SIGN_IN);
    },
  });

  return (
    <div className="w-full max-w-105">
      <p className="mb-7 text-center text-[18px] leading-7 text-neutral-700 dark:text-white/70">
        Введите код из письма и новый пароль.
      </p>

      <div className="overflow-hidden rounded-2xl border border-neutral-300 shadow-sm dark:border-white/10">
        <AuthFieldRow
          label="Email"
          type="email"
          name="email"
          value={form.email}
          error={errors.email}
          onChange={handleChange}
          placeholder="Введите email"
          containerClassName="border-b px-5 py-3 border-neutral-200 bg-white dark:border-white/10 dark:bg-[#111418]"
        />

        <AuthFieldRow
          label="Код подтверждения"
          type="text"
          name="code"
          value={form.code}
          error={errors.code}
          onChange={handleChange}
          placeholder="000000"
          containerClassName="border-b px-5 py-3 border-neutral-200 bg-white dark:border-white/10 dark:bg-[#111418]"
          inputClassName="tracking-[0.5em] text-center"
        />

        <AuthFieldRow
          label="Новый пароль"
          type="password"
          name="password"
          value={form.password}
          error={errors.password}
          onChange={handleChange}
          placeholder="Введите пароль"
          containerClassName="border-b px-5 py-3 border-neutral-200 bg-white dark:border-white/10 dark:bg-[#111418]"
        />

        <AuthFieldRow
          label="Подтвердите пароль"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          error={errors.confirmPassword}
          onChange={handleChange}
          placeholder="Повторите пароль"
          containerClassName="relative px-5 py-3 pr-14 bg-white dark:bg-[#111418]"
        >
          {form.password && form.confirmPassword && (
            <ArrowActionButton
              onClick={handleSubmit}
              loading={loading}
              className="absolute right-4 top-6 h-11 w-11 rounded-full border-2 border-neutral-400 bg-transparent hover:bg-white/40 dark:border-white/30 dark:hover:bg-white/10"
            />
          )}
        </AuthFieldRow>
      </div>

      {formError && (
        <p className="mt-4 text-center text-sm text-red-500 dark:text-red-400">
          {formError}
        </p>
      )}
    </div>
  );
}
