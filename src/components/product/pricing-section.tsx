import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { purchaseProductAction } from "@/actions/purchase.action";
import type { IPricingPlan } from "@/types/product.types";

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency, maximumFractionDigits: 0 }).format(price);
}

function billingLabel(period: IPricingPlan["billingPeriod"]) {
  return { MONTHLY: "в месяц", QUARTERLY: "в квартал", YEARLY: "в год", ONE_TIME: "разовый платеж" }[period];
}

export function PricingSection({ title = "Тарифы", description, plans, productId, productHref, isFree }: { title?: string; description?: string; plans: IPricingPlan[]; productId?: string; productHref?: string; isFree?: boolean }) {
  return (
    <section id="pricing" className="border-t border-black/5 bg-[#f5f5f7] px-6 py-20 dark:border-white/10 dark:bg-[#090909] md:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1D4ED8]">
            Тарифы
          </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {description && <p className="mt-4 text-base leading-7 text-black/50 dark:text-white/50 sm:text-lg">{description}</p>}</div>
        {plans.length ? <div className="mt-10 grid gap-3 lg:grid-cols-3">
          {plans.map((plan) => <article key={plan.id} className={`relative flex flex-col rounded-[1.75rem] border p-6 ${plan.isPopular ? "border-[#1D4ED8]/40 bg-[#eff6ff] dark:bg-[#0e1729]" : "border-black/5 bg-white dark:border-white/10 dark:bg-[#111418]"}`}>
            {plan.isPopular && <span className="absolute right-5 top-5 rounded-full bg-[#1D4ED8] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">Популярный</span>}
            <h3 className="text-lg font-semibold">{plan.name}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-black/45 dark:text-white/45">{plan.description}</p>
            <div className="mt-7"><p className="text-3xl font-semibold tracking-tight">{isFree ? "Бесплатно" : formatPrice(plan.price, plan.currency)}</p><p className="mt-1 text-xs text-black/40 dark:text-white/40">{billingLabel(plan.billingPeriod)}{plan.seats ? ` · до ${plan.seats} мест` : ""}</p></div>
            <ul className="mt-7 flex flex-1 flex-col gap-3">{plan.features.map((feature) => <li key={feature} className="flex gap-3 text-sm leading-6 text-black/60 dark:text-white/60"><Check className="mt-1 h-4 w-4 shrink-0 text-[#1D4ED8]" />{feature}</li>)}</ul>
            <div className="mt-8">{productId ? <form action={purchaseProductAction} className="space-y-2"><input type="hidden" name="productId" value={productId} /><input type="hidden" name="pricingPlanId" value={plan.id} /><input name="organizationName" placeholder="Название проекта (необязательно)" className="h-11 w-full rounded-full border border-black/10 bg-transparent px-4 text-sm outline-none placeholder:text-black/30 focus:border-black/25 dark:border-white/10 dark:placeholder:text-white/30" /><Button type="submit" className="w-full rounded-full">Выбрать тариф</Button></form> : <Button asChild className="w-full rounded-full"><Link href={productHref ?? "#"}>Выбрать тариф</Link></Button>}</div>
          </article>)}
        </div> 
        :
        <div className="mt-10 rounded-3xl border border-dashed border-black/10 p-10 text-center dark:border-white/10"><p className="text-sm text-black/45 dark:text-white/45">Тарифы для этого продукта пока не настроены.</p>{productHref && <Link href={productHref} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#1D4ED8]">Открыть продукт <ArrowRight className="h-4 w-4" /></Link>}</div>}
      </div>
    </section>
  );
}
