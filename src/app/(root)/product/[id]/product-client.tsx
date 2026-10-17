import { IProduct } from "@/types/product.types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, Tag } from "lucide-react";
import { SolutionSection } from "@/components/product/solution-section";
import Link from "next/link";
import { PricingSection } from "@/components/prising/pricing-section";
import { PAGES } from "@/config/pages.config";

interface ProductClientProps {
  product: IProduct;
}

export default function ProductClient({ product }: ProductClientProps) {
  const pricingPlans = product.pricingPlans ?? [];

  return (
    <main className="min-h-screen bg-[#f9f9f9] text-black dark:bg-black dark:text-white">
      <section className="relative min-h-[70vh] overflow-hidden flex items-center">
        <div
          className="absolute inset-0 bg-linear-to-br"
          style={{
            background: `linear-gradient(to bottom right, ${product.theme.from}, ${product.theme.via}, ${product.theme.to})`,
          }}
        />

        <div className={`absolute -top-40 -left-40 w-125 h-125 rounded-full blur-3xl ${product.theme.glow1}`} />
        <div className={`absolute -bottom-40 -right-40 w-125 h-125 rounded-full blur-3xl ${product.theme.glow2}`} />

        <div
          className="absolute top-0 right-0 h-full w-[55%] hidden lg:block"
          style={{
            clipPath: "ellipse(100% 100% at 100% 50%)",
          }}
        >
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-10 w-full px-6 py-20 md:px-12 lg:px-20">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex rounded-full bg-black/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-black/60">
              {product.badge}
            </span>

            <div>
              <h1 className="text-4xl font-semibold leading-tight text-[#2C1810] sm:text-5xl">
                {product.title}
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-[#2C1810]/70 sm:text-lg">
                {product.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href={PAGES.PRICING}>
                  Посмотреть тарифы
                </Link>
              </Button>

              <Button size="lg" variant="secondary" asChild>
                <Link href={PAGES.CONTACTS}>
                  Запросить демо <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-3 pt-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white/70 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <Tag className="h-4 w-4 text-[#1D4ED8]" />
                  Тарифы
                </div>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {pricingPlans.length}
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white/70 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <CalendarDays className="h-4 w-4 text-[#1D4ED8]" />
                  Доступ
                </div>
                <p className="mt-2 text-sm font-semibold leading-6 text-gray-900">
                  {product.isFree ? "Бесплатно" : "По тарифу"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {product.solutionSection && <SolutionSection data={product.solutionSection} />}

      <PricingSection
        title={`${product.title}: тарифы и планы`}
        description="Тарифы можно настроить под конкретный проект или использовать как базовые планы для организации."
        plans={pricingPlans}
        productId={product.id}
        isFree={product.isFree}
        productHref={PAGES.PRODUCT(product.id)}
      />

      <section className="border-t border-black/10 bg-black text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">
              Готово к запуску
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Запускайте продукт быстрее и масштабируйтесь без ограничений.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
              Всё необходимое для роста: удобные инструменты, гибкость и высокая производительность.
            </p>
          </div>

          <div className="flex gap-3">
            <Button size="lg" variant="secondary" asChild>
              <Link href="#pricing">
                Выбрать тариф
              </Link>
            </Button>

            <Button
              variant="outline"
              className="rounded-full border-white/15 bg-white/5 px-6 py-6 text-white hover:bg-white hover:text-black"
              asChild
            >
              <Link href="#pricing">
                Посмотреть тарифы
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
