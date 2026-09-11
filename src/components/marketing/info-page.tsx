import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { PAGES } from "@/config/pages.config";

export interface InfoPageProps {
  eyebrow: string;
  title: string;
  description: string;
  items: { title: string; text: string }[];
  cta?: { label: string; href: string };
}

export function InfoPage({ eyebrow, title, description, items, cta = { label: "Посмотреть продукты", href: PAGES.PRODUCTS } }: InfoPageProps) {
  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] dark:bg-[#090909] dark:text-white">
      <section className="relative overflow-hidden border-b border-black/5 dark:border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(29,78,216,0.10),transparent_35%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(29,78,216,0.18),transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
          <div className="max-w-4xl">
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-[#1D4ED8]">{eyebrow}</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">{title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/55 dark:text-white/55">{description}</p>
            <Link href={cta.href} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90">{cta.label}<ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => <article key={item.title} className="rounded-3xl border border-black/5 bg-white p-7 shadow-[0_2px_18px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-[#111418] dark:shadow-none"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eff6ff] dark:bg-blue-500/10"><Check className="h-5 w-5 text-[#1D4ED8]" /></div><h2 className="mt-5 text-lg font-semibold tracking-tight">{item.title}</h2><p className="mt-2 text-sm leading-6 text-black/50 dark:text-white/50">{item.text}</p></article>)}
        </div>
      </section>
    </main>
  );
}
