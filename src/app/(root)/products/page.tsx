import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, Layers3 } from "lucide-react";
import Link from "next/link";
import { PAGES } from "@/config/pages.config";
import { getProductsAction } from "@/actions/saas.actions";
import { IProduct } from "@/types/product.types";

function getProductClass(index: number, length: number) {
  const isLastOddItem = length % 2 === 1 && index === length - 1;

  return isLastOddItem ? "md:col-span-2" : "";
}

function formatDate(value?: string | null) {
  if (!value) return "Нет сроков";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function ERPProductsPage() {
  const products = await getProductsAction();

  return (
    <main className="min-h-screen">
      <section className="px-6 pb-8 pt-16 md:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1D4ED8]">
            Продукты
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
            Продукты, проекты и тарифы в одной системе
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-500 sm:text-lg">
            Все данные берутся из базы: продукты, связанные организации, проекты с дедлайнами и тарифные планы.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
        {products.map((product: IProduct, index: number) => {
          return (
            <div
              key={product.id}
              className={`relative flex min-h-136 flex-col overflow-hidden px-8 pb-10 pt-14 ${getProductClass(index, products.length)}`}
            >
              <Image
                src={product.image}
                alt={product.imageAlt}
                fill
                className="object-cover object-center"
                priority={index === 0}
              />

              <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/40 to-black/75" />

              <div className="relative z-10 flex flex-1 flex-col items-center justify-between text-center text-white">
                <div>
                  <span className="mb-4 inline-block rounded-full border border-white/30 bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
                    {product.badge}
                  </span>

                  <h2 className="text-[36px] font-bold leading-tight tracking-tight sm:text-[44px]">
                    {product.title}
                  </h2>

                  <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/75">
                    {product.subtitle}
                  </p>
                </div>

                {/* <div className="grid w-full gap-3 sm:max-w-2xl sm:grid-cols-3">
                  <div className="rounded-3xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur-md">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
                      <Layers3 className="h-4 w-4" />
                      Тарифы
                    </div>
                    <p className="mt-2 text-2xl font-semibold">{product.pricingPlans?.length ?? 0}</p>
                  </div>

                  <div className="rounded-3xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur-md">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
                      <CalendarDays className="h-4 w-4" />
                      Дедлайн
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-6 text-white">
                      {formatDate(nextDeadline)}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur-md">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
                      <Layers3 className="h-4 w-4" />
                      Проекты
                    </div>
                    <p className="mt-2 text-2xl font-semibold">{product.projects?.length ?? 0}</p>
                  </div>
                </div> */}

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Button size={"lg"} asChild className="rounded-full">
                    <Link href={PAGES.PRODUCT(product.id)}>
                      Подробнее
                    </Link>
                  </Button>

                  <Button size={"lg"} variant={"secondary"} className="rounded-full">
                    Запросить демо <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Единая платформа для управления бизнесом
          </h2>
          <p className="text-black/60 text-lg leading-relaxed dark:text-white/60">
            Продукты объединяются в одну базу, а организации видят свои проекты, сроки и тарифы без ручной синхронизации.
          </p>
        </div>
      </section>
    </main>
  );
}
