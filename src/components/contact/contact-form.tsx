"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONFIG } from "@/config/app.config";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const topic = String(form.get("topic") ?? "Запрос").trim();
    const message = String(form.get("message") ?? "").trim();

    const body = [
      `Имя: ${name}`,
      `Email: ${email}`,
      "",
      message,
    ].join("\\n");

    window.location.href = `mailto:info@${CONFIG.appDomain}?subject=${encodeURIComponent(topic)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Ваше имя" placeholder="Имя" required />
        <Field name="email" label="Email" placeholder="you@example.com" type="email" required />
      </div>

      <Field name="topic" label="Тема" placeholder="Например, внедрение ERP" required />

      <div className="space-y-1.5">
        <label htmlFor="message" className="text-sm font-medium text-[#1d1d1f] dark:text-white">
          Сообщение
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Расскажите, чем мы можем помочь..."
          className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[#1d1d1f] outline-none transition placeholder:text-black/30 focus:border-black/25 dark:border-white/10 dark:bg-[#111418] dark:text-white dark:placeholder:text-white/30 dark:focus:border-white/25"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-black/40 dark:text-white/40">
          Кнопка откроет ваше почтовое приложение с уже подготовленным письмом.
        </p>
        <Button type="submit" size="lg" className="rounded-full">
          Отправить запрос
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>

      {sent && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          Письмо подготовлено. Завершите отправку в почтовом приложении.
        </div>
      )}
    </form>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-sm font-medium text-[#1d1d1f] dark:text-white">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-[#1d1d1f] outline-none transition placeholder:text-black/30 focus:border-black/25 dark:border-white/10 dark:bg-[#111418] dark:text-white dark:placeholder:text-white/30 dark:focus:border-white/25"
      />
    </div>
  );
}
