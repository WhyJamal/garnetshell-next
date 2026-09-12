"use client";

import { AuthFieldRow } from "@components/auth/auth-field-row";
import { ArrowActionButton } from "@components/auth/arrow-action-button";
import { useState } from "react";
import { registerAction } from "@actions/register.action";
import { useForm } from "@/hooks/use-form";
import { signUpSchema } from "@/schema/sign-up-schema";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { PAGES } from "@config/pages.config";

export default function SignUpCard() {
  const [step, setStep] = useState<"base" | "password">("base");
  const [formError, setFormError] = useState("");

  const router = useRouter();

  const {
    values: form,
    errors,
    loading,
    handleChange,
    handleSubmit,
  } = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    schema: signUpSchema,
    onSubmit: async (data) => {
      setFormError("");

      const result = await registerAction(data);

      if (!result.success) {
        setFormError(result.error);
        return;
      }

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setFormError("Аккаунт создан, но войти не удалось. Попробуйте войти вручную.");
        router.push(PAGES.SIGN_IN);
        return;
      }

      router.push(PAGES.VERIFY_EMAIL);
    },
  });

  const handleNext = async () => {
    setStep("password");
  };

  return (
    <div className="w-full max-w-105">
      <p className="mb-7 text-center text-[18px] leading-7 text-neutral-700 dark:text-white/70">
        Создайте учетную запись, чтобы продолжить.
      </p>

      <div className="overflow-hidden rounded-2xl border border-neutral-300 shadow-sm dark:border-white/10">
        <AuthFieldRow
          label="Имя пользователя"
          type="text"
          name="name"
          value={form.name}
          error={errors.name}
          onChange={handleChange}
          placeholder="Введите имя"
          containerClassName={`border-b px-5 py-3 transition-colors duration-300 ${
            step === "password"
              ? "border-neutral-300 bg-[#dfeaf8] dark:border-white/10 dark:bg-[#17202b]"
              : form.name
                ? "border-neutral-200 bg-yellow-100 dark:border-white/10 dark:bg-yellow-500/10"
                : "border-neutral-200 bg-white dark:border-white/10 dark:bg-[#111418]"
          }`}
        />

        <AuthFieldRow
          label="Электронная почта"
          type="email"
          name="email"
          value={form.email}
          error={errors.email}
          onChange={handleChange}
          placeholder="Введите email"
          containerClassName={`relative border-b px-5 py-3 transition-colors duration-300 ${
            step === "password"
              ? "border-neutral-300 bg-[#dfeaf8] dark:border-white/10 dark:bg-[#17202b]"
              : form.email
                ? "border-neutral-200 bg-yellow-100 dark:border-white/10 dark:bg-yellow-500/10"
                : "border-neutral-200 bg-white dark:border-white/10 dark:bg-[#111418]"
          }`}
        >
          {step === "base" && form.name && form.email && (
            <ArrowActionButton
              onClick={handleNext}
              loading={loading}
              variant="outline"
              className="absolute right-4 top-6 h-11 w-11 rounded-full border-2 border-neutral-400 bg-transparent hover:bg-white/40 dark:border-white/30 dark:hover:bg-white/10"
            />
          )}
        </AuthFieldRow>

        {step === "password" && (
          <>
            <AuthFieldRow
              label="Пароль"
              type="password"
              name="password"
              error={errors.password}
              value={form.password}
              onChange={handleChange}
              placeholder="Введите пароль"
              containerClassName={`border-b px-5 py-3 transition-colors duration-300 ${
                form.password
                  ? "border-neutral-200 bg-yellow-100 dark:border-white/10 dark:bg-yellow-500/10"
                  : "border-neutral-200 bg-white dark:border-white/10 dark:bg-[#111418]"
              }`}
            />

            <AuthFieldRow
              label="Подтвердите пароль"
              type="password"
              name="confirmPassword"
              error={errors.confirmPassword}
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Повторите пароль"
              containerClassName={`relative px-5 py-3 pr-14 transition-colors duration-300 ${
                form.confirmPassword
                  ? "bg-yellow-100 dark:bg-yellow-500/10"
                  : "bg-white dark:bg-[#111418]"
              }`}
            >
              {form.password && form.confirmPassword && (
                <ArrowActionButton
                  onClick={handleSubmit}
                  loading={loading}
                  className="absolute right-4 top-6 h-11 w-11 rounded-full border-2 border-neutral-400 bg-transparent hover:bg-white/40 dark:border-white/30 dark:hover:bg-white/10"
                />
              )}
            </AuthFieldRow>
          </>
        )}
      </div>

      {formError && (
        <p className="mt-4 text-center text-sm text-red-500 dark:text-red-400">
          {formError}
        </p>
      )}

      <p className="mt-6 text-center text-sm leading-6 text-neutral-500 dark:text-white/40">
        Регистрируясь, вы соглашаетесь с{" "}
        <span className="cursor-pointer text-blue-600 hover:underline dark:text-blue-400">
          условиями использования
        </span>{" "}
        и{" "}
        <span className="cursor-pointer text-blue-600 hover:underline dark:text-blue-400">
          политикой конфиденциальности
        </span>
        .
      </p>
    </div>
  );
}

