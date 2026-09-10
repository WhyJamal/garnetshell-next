"use client";

import { useState } from "react";

export function LoginHintBanner({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const [copied, setCopied] = useState<"email" | "password" | null>(null);

  const copy = async (value: string, which: "email" | "password") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // Если буфер обмена недоступен — ничего не делаем, текст всё равно виден
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 dark:border-amber-900/60 dark:bg-amber-950/30">
      <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
        Данные для входа в приложение — это сообщение будет показано только
        сейчас и больше не появится. Сохраните их.
      </p>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-100 bg-white px-3 py-2 dark:border-amber-900/50 dark:bg-slate-900">
          <div className="min-w-0">
            <p className="text-[11px] text-black/40 dark:text-white/40">Email</p>
            <p className="truncate text-sm font-mono text-[#1d1d1f] dark:text-white">{email}</p>
          </div>
          <button
            type="button"
            onClick={() => copy(email, "email")}
            className="shrink-0 rounded-full bg-[#1d1d1f] px-3 py-1 text-[11px] font-medium text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            {copied === "email" ? "Скопировано" : "Копировать"}
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-100 bg-white px-3 py-2 dark:border-amber-900/50 dark:bg-slate-900">
          <div className="min-w-0">
            <p className="text-[11px] text-black/40 dark:text-white/40">Пароль</p>
            <p className="truncate text-sm font-mono text-[#1d1d1f] dark:text-white">{password}</p>
          </div>
          <button
            type="button"
            onClick={() => copy(password, "password")}
            className="shrink-0 rounded-full bg-[#1d1d1f] px-3 py-1 text-[11px] font-medium text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            {copied === "password" ? "Скопировано" : "Копировать"}
          </button>
        </div>
      </div>

      <p className="text-xs text-amber-700 dark:text-amber-300">
        Пароль можно в любое время изменить в приложении в разделе
        Профиль → Безопасность.
      </p>
    </div>
  );
}
