import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPricingProductsAction } from "@/actions/saas.actions";
import { PricingSection } from "@/components/product/pricing-section";
import { Button } from "@/components/ui/button";
import { PAGES } from "@/config/pages.config";
import type { IProduct } from "@/types/product.types";

export default async function PricingPage() {
  const products = await getPricingProductsAction();

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] dark:bg-[#090909] dark:text-white">
      <section className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1D4ED8]">
          Цены
        </p>
        <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
          Понятные тарифы без лишней сложности.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-black/55 dark:text-white/55">
          Выберите продукт, подходящий план и запустите проект. Для индивидуальных условий можно связаться с нами напрямую.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full">
            <Link href={PAGES.PRODUCTS}>
              Все продукты
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="rounded-full">
            <Link href={PAGES.CONTACTS}>
              Индивидуальные условия 
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {products.map((product: IProduct) => 
        <PricingSection 
          key={product.id} 
          title={product.title} 
          description={product.subtitle} 
          plans={product.pricingPlans ?? []} 
          productId={product.id} 
          productHref={PAGES.PRODUCT(product.id)} 
          isFree={product.isFree} 
        />
      )}
    </main>
  );
}
