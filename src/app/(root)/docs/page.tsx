import Link from "next/link";
import { ArrowRight, BookOpen, CircleHelp } from "lucide-react";
import { PAGES } from "@/config/pages.config";
export default function DocsPage() {
    return (
        <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] dark:bg-[#090909] dark:text-white">
            <section className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1D4ED8]">
                    Документация
                </p>
                <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
                    Знания, которые помогают быстро начать работу.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-black/55 dark:text-white/55">
                Пока документация развивается, команда поддержки поможет пройти настройку продукта и интеграций.</p>
                <div className="mt-12 grid gap-3 md:grid-cols-2">
                    <Link href={PAGES.SUPPORT} className="rounded-3xl border border-black/5 bg-white p-7 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-white/10 dark:bg-[#111418]">
                        <CircleHelp className="h-6 w-6 text-[#1D4ED8]" />
                        <h2 className="mt-5 text-lg font-semibold">
                            Центр поддержки
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-black/50 dark:text-white/50">
                            Ответы по аккаунту, продуктам и основным сценариям.
                        </p>
                        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#1D4ED8]">
                            Открыть поддержку 
                            <ArrowRight className="h-4 w-4" />
                        </span>
                    </Link>
                    <Link href={PAGES.PRODUCTS} className="rounded-3xl border border-black/5 bg-white p-7 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-white/10 dark:bg-[#111418]">
                        <BookOpen className="h-6 w-6 text-[#1D4ED8]" />
                        <h2 className="mt-5 text-lg font-semibold">
                            Продукты
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-black/50 dark:text-white/50">
                            Изучите продукты и их возможности перед запуском.
                        </p>
                        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#1D4ED8]">
                            Каталог продуктов 
                            <ArrowRight className="h-4 w-4" />
                        </span>
                    </Link>
                </div>
            </section>
        </main>
    );
}
