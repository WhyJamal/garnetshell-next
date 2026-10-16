"use client";

import * as React from "react";

import Link from "next/link";
import { ArrowRight, BookOpen, Mail, MessageCircle, Search, ShieldCheck, Wrench } from "lucide-react";
import { PAGES } from "@/config/pages.config";
import { CONFIG } from "@/config/app.config";

const topics = [
  { title: "Начало работы", text: "Подключение продукта, организация и первый проект.", icon: BookOpen },
  { title: "Аккаунт и доступ", text: "Профиль, пароль, безопасность и вход в систему.", icon: ShieldCheck },
  { title: "Продукты и тарифы", text: "Выбор продукта, тарифный план и запуск проекта.", icon: Wrench },
  { title: "Интеграции", text: "Подключение внешних систем и корпоративных сервисов.", icon: MessageCircle },
];

export function SupportCenter() {
  const [query, setQuery] = React.useState("");
  const normalized = query.trim().toLowerCase();
  const filtered = topics.filter((topic) =>
    `${topic.title} ${topic.text}`.toLowerCase().includes(normalized),
  );

  return (
    <>
      <div className="relative mx-auto mt-10 max-w-2xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35 dark:text-white/35" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск по темам поддержки..."
          className="h-12 w-full rounded-full border border-black/10 pl-11 pr-5 text-sm outline-none shadow-sm transition focus:border-black/20 dark:border-white/10 ark:bg-white/4 dark:text-white dark:focus:border-white/20"
        />
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {filtered.map((topic) => {
          const Icon = topic.icon;
          return (
            <article key={topic.title} className="group rounded-3xl border border-black/5 bg-white p-6 shadow-[0_2px_18px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.07)] dark:border-white/10 dark:bg-[#111418] dark:shadow-none">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f5f5f7] dark:bg-white/10">
                <Icon className="h-5 w-5 text-[#1D4ED8]" />
              </div>
              <h2 className="mt-5 text-base font-semibold tracking-tight text-[#1d1d1f] dark:text-white">{topic.title}</h2>
              <p className="mt-2 text-sm leading-6 text-black/50 dark:text-white/50">{topic.text}</p>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-black/10 px-6 py-10 text-center dark:border-white/10">
          <p className="text-sm text-black/50 dark:text-white/50">По вашему запросу тем не найдено.</p>
          <Link href={PAGES.CONTACTS} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#1D4ED8]">
            Связаться с командой <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      <div className="mt-12 grid gap-3 sm:grid-cols-2">
        <a href={`mailto:info@${CONFIG.appDomain}`} className="rounded-3xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-[#111418]">
          <Mail className="h-5 w-5 text-[#1D4ED8]" />
          <p className="mt-4 text-sm font-semibold text-[#1d1d1f] dark:text-white">Email поддержки</p>
          <p className="mt-1 text-sm text-black/45 dark:text-white/45">{CONFIG.appContact.email}</p>
        </a>
        <Link href={PAGES.CONTACTS} className="rounded-3xl border border-black/5 bg-white p-5 transition hover:border-black/10 dark:border-white/10 dark:bg-[#111418] dark:hover:border-white/20">
          <MessageCircle className="h-5 w-5 text-[#1D4ED8]" />
          <p className="mt-4 text-sm font-semibold text-[#1d1d1f] dark:text-white">Связаться с нами</p>
          <p className="mt-1 text-sm text-black/45 dark:text-white/45">Обсудим задачу и подскажем следующий шаг.</p>
        </Link>
      </div>
    </>
  );
}

