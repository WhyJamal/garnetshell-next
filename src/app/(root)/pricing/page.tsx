import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPricingProductsAction } from "@/actions/saas.actions";
import { Button } from "@/components/ui/button";
import { PricingSection } from "@/components/product/pricing-section";
import { PAGES } from "@/config/pages.config";
import { IProduct } from "@/types/product.types";

export default async function PricingPage() {
  const products = await getPricingProductsAction();

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-black">
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1D4ED8]">
            Цены
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Прайсинг, который подстраивается под продукт и проект
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-500 sm:text-lg">
            Каждый продукт может иметь собственные тарифы, а проект — отдельные условия и план внедрения.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link href={PAGES.PRODUCTS}>
                Все продукты
              </Link>
            </Button>

            <Button asChild size="lg" variant="secondary" className="rounded-full">
              <Link href={PAGES.HOME}>
                На главную <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-3 px-3 pb-3 md:px-6">
        {products.map((product: IProduct) => (
          <div key={product.id} className="rounded-[2rem] bg-white p-3 shadow-sm ring-1 ring-black/5">
            <div className="mx-auto px-3 pt-3">
              <div className="flex flex-col gap-3 rounded-t-[1.75rem] bg-[#f8fafc] p-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1D4ED8]">
                    {product.badge}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                    {product.title}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500 sm:text-base">
                    {product.subtitle}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href={PAGES.PRODUCT(product.id)}>
                      Открыть продукт
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <PricingSection
              title={`Тарифы для «${product.title}»`}
              description="Базовые тарифы и проектные условия собраны в одном месте."
              plans={product.pricingPlans ?? []}
              productId={product.id}
              isFree={product.isFree}
              productHref={PAGES.PRODUCT(product.id)}
            />
          </div>
        ))}
      </section>
    </main>
  );
}
