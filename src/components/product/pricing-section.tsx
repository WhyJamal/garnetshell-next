import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IPricingPlan } from "@/types/product.types";
import { purchaseProductAction } from "@/actions/purchase.action";

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function billingLabel(period: IPricingPlan["billingPeriod"]) {
  switch (period) {
    case "MONTHLY":
      return "в месяц";
    case "QUARTERLY":
      return "в квартал";
    case "YEARLY":
      return "в год";
    case "ONE_TIME":
      return "разовый платеж";
    default:
      return "";
  }
}

export function PricingSection({
  title = "Тарифы",
  description,
  plans,
  productId,
  productHref,
  isFree,
}: {
  title?: string;
  description?: string;
  plans: IPricingPlan[];
  productId?: string;
  productHref?: string;
  isFree?: boolean;
}) {
  if (!plans.length) {
    return null;
  }

  return (
    <section id="pricing" className="border-t border-black/10 bg-white dark:bg-black dark:border-white/10 px-6 py-20 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1D4ED8]">
            Прайсинг
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-base leading-7 text-gray-500 dark:text-gray-300 sm:text-lg">
              {description}
            </p>
          )}
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`flex h-full flex-col rounded-3xl p-6 shadow-sm transition-all border-2 ${plan.isPopular ? "border-[#1D4ED8]/30 bg-[#EFF6FF] shadow-md dark:bg-[#0F172A]" : "border-black/10 bg-white dark:bg-black dark:border-white/10"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-300">
                    {plan.description}
                  </p>
                </div>

                {plan.isPopular && (
                  <span className="rounded-full bg-[#1D4ED8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                    Популярный
                  </span>
                )}
              </div>

              <div className="mt-6">
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                    {isFree ? "Бесплатно" : formatPrice(plan.price, plan.currency)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  {billingLabel(plan.billingPeriod)}
                  {plan.projectName ? ` · ${plan.projectName}` : ""}
                </p>
              </div>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1D4ED8]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {productId ? (
                  <form action={purchaseProductAction} className="space-y-2">
                    <input type="hidden" name="productId" value={productId} />
                    <input type="hidden" name="pricingPlanId" value={plan.id} />
                    <input
                      type="text"
                      name="organizationName"
                      placeholder="Название магазина (необязательно)"
                      className="w-full rounded-full border border-black/10 px-4 py-2 text-sm outline-none focus:border-black/25"
                    />
                    <Button type="submit" className="w-full rounded-full">
                      Выбрать тариф
                    </Button>
                  </form>
                ) : (
                  <Button asChild className="w-full rounded-full">
                    <Link href={productHref ?? "#"}>
                      Выбрать тариф
                    </Link>
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
