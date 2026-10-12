import Link from "next/link";
import { ArrowRight, Boxes, Cloud, LockKeyhole, Sparkles } from "lucide-react";
import { PAGES } from "@/config/pages.config";
import { CONFIG } from "@/config/app.config";

const principles = [
  { icon: Boxes, title: "Единая экосистема", text: "Продукты работают как часть одной платформы, а не как набор разрозненных сервисов." },
  { icon: Cloud, title: "Облако без лишнего", text: "Фокусируемся на понятных интерфейсах, быстрых сценариях и данных, которыми легко управлять." },
  { icon: LockKeyhole, title: "Контроль данных", text: "Архитектура строится вокруг прозрачности, доступа по ролям и безопасной работы с бизнес-данными." },
];

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] dark:bg-[#090909] dark:text-white">
      <section className="relative overflow-hidden border-b border-black/5 dark:border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(29,78,216,0.10),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(0,0,0,0.06),transparent_30%)] dark:bg-[radial-gradient(circle_at_15%_20%,rgba(29,78,216,0.18),transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
          <div className="max-w-4xl">
            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.04em] sm:text-6xl md:text-7xl">
              Цифровые продукты для бизнеса, которые не мешают работать.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/55 dark:text-white/55 sm:text-xl">
              {CONFIG.appName} создаёт корпоративные SaaS-решения для управления процессами, людьми и данными — с простым интерфейсом и единым подходом к продукту.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={PAGES.PRODUCTS} className="inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90">
                Посмотреть продукты <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={PAGES.CONTACTS} className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-5 py-3 text-sm font-medium backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                Обсудить проект
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1D4ED8]">Как мы думаем</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Меньше сложности. Больше контроля.</h2>
          <p className="mt-4 text-base leading-7 text-black/55 dark:text-white/55 sm:text-lg">
            Мы проектируем продукты вокруг реальных рабочих сценариев: от первой настройки до ежедневного использования и масштабирования.
          </p>
        </div>

        <div className="mt-12 grid gap-3 md:grid-cols-3">
          {principles.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-3xl border border-black/5 bg-white p-7 shadow-[0_2px_18px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-[#111418] dark:shadow-none">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eff6ff] dark:bg-blue-500/10">
                <Icon className="h-5 w-5 text-[#1D4ED8]" />
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-black/50 dark:text-white/50">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
