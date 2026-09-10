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
    <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-4 space-y-3">
      <p className="text-sm font-medium text-amber-800">
        Данные для входа в приложение — это сообщение будет показано только
        сейчас и больше не появится. Сохраните их.
      </p>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3 rounded-xl bg-white border border-amber-100 px-3 py-2">
          <div className="min-w-0">
            <p className="text-[11px] text-black/40">Email</p>
            <p className="text-sm font-mono truncate">{email}</p>
          </div>
          <button
            type="button"
            onClick={() => copy(email, "email")}
            className="shrink-0 rounded-full bg-[#1d1d1f] px-3 py-1 text-[11px] font-medium text-white"
          >
            {copied === "email" ? "Скопировано" : "Копировать"}
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-white border border-amber-100 px-3 py-2">
          <div className="min-w-0">
            <p className="text-[11px] text-black/40">Пароль</p>
            <p className="text-sm font-mono truncate">{password}</p>
          </div>
          <button
            type="button"
            onClick={() => copy(password, "password")}
            className="shrink-0 rounded-full bg-[#1d1d1f] px-3 py-1 text-[11px] font-medium text-white"
          >
            {copied === "password" ? "Скопировано" : "Копировать"}
          </button>
        </div>
      </div>

      <p className="text-xs text-amber-700">
        Пароль можно в любое время изменить в приложении в разделе
        Профиль → Безопасность.
      </p>
    </div>
  );
}
