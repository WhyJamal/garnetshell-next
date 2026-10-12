import { SupportCenter } from "@/components/support/support-center";
import { CONFIG } from "@/config/app.config";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] dark:bg-[#090909] dark:text-white">
      <section className="border-b border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center md:px-10 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1D4ED8]">
            Поддержка
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Помощь, когда она нужна.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-black/55 dark:text-white/55">
            Найдите нужную тему или сразу свяжитесь с командой {CONFIG.appName}.
          </p>
          <div className="mx-auto max-w-4xl text-left">
            <SupportCenter />
          </div>
        </div>
      </section>
    </main>
  );
}
