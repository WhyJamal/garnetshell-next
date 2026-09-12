"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthFieldRow } from "@components/auth/auth-field-row";
import { ArrowActionButton } from "@components/auth/arrow-action-button";
import { Button } from "@/components/ui/button";
import { PAGES } from "@config/pages.config";
import { verifyEmailAction, resendVerificationCodeAction } from "@actions/verify-email.action";

export default function VerifyEmailCard({ email }: { email: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleSubmit = async () => {
    if (code.length !== 6) {
      setError("Код должен содержать 6 цифр");
      return;
    }

    setLoading(true);
    setError("");

    const result = await verifyEmailAction(code);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push(PAGES.ACCOUNT);
    router.refresh();
  };

  const handleResend = async () => {
    setResending(true);
    setError("");

    const result = await resendVerificationCodeAction();

    setResending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setResent(true);
  };

  return (
    <div className="w-full max-w-105">
      <p className="mb-7 text-center text-[18px] leading-7 text-neutral-700 dark:text-white/70">
        На {email} отправлен 6-значный код. Введите его, чтобы подтвердить email.
      </p>

      <div className="overflow-hidden rounded-2xl border border-neutral-300 bg-white shadow-sm dark:border-white/10 dark:bg-[#111418]">
        <AuthFieldRow
          label="Код подтверждения"
          type="text"
          name="code"
          value={code}
          error={error}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="000000"
          containerClassName="relative px-5 py-3 pr-14 border-neutral-200 bg-white dark:border-white/10 dark:bg-[#111418]"
          inputClassName="tracking-[0.5em] text-center"
        >
          {code.length === 6 && (
            <ArrowActionButton
              onClick={handleSubmit}
              loading={loading}
              className="absolute right-4 top-6 h-11 w-11 rounded-full border-2 border-neutral-400 bg-transparent hover:bg-white/40 dark:border-white/30 dark:hover:bg-white/10"
            />
          )}
        </AuthFieldRow>
      </div>

      <div className="mt-6 text-center text-sm text-neutral-500 dark:text-white/40">
        Код не пришёл?{" "}
        <Button
          type="button"
          variant="link"
          onClick={handleResend}
          disabled={resending}
          className="p-0 text-sm text-blue-600 dark:text-blue-400"
        >
          {resending ? "Отправка…" : resent ? "Отправить ещё раз" : "Отправить снова"}
        </Button>
      </div>
    </div>
  );
}
