import Link from "next/link";
import { ArrowUpRight, Globe, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { CONFIG } from "@/config/app.config";

const contacts = [
  { icon: MapPin, label: "Офис", value: "Фергана, Узбекистан" },
  { icon: Mail, label: "Email", value: CONFIG.appContact.email, href: `mailto:${CONFIG.appContact.email}` },
  { icon: Phone, label: "Телефон", value: CONFIG.appContact.phone, href: `tel:${CONFIG.appContact.phone}` },
  { icon: Globe, label: "Сайт", value: CONFIG.appContact.website, href: CONFIG.appContact.website },
];

export default function ContactsPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] dark:bg-[#090909] dark:text-white">
      <section className="border-b border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1D4ED8]">Контакты</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">Давайте обсудим, что нужно вашему бизнесу.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-black/55 dark:text-white/55">Расскажите о задаче, продукте или интеграции. Мы свяжемся с вами и предложим подходящий следующий шаг.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:py-24">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Контактная информация</h2>
          <div className="mt-8 space-y-3">
            {contacts.map(({ icon: Icon, label, value, href }) => {
              const content = <><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-[#111418]"><Icon className="h-5 w-5 text-[#1D4ED8]" /></div><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-black/35 dark:text-white/35">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div></>;
              return href ? <a key={label} href={href} className="flex items-center gap-4 rounded-3xl border border-black/5 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-white/10 dark:bg-[#111418]">{content}</a> : <div key={label} className="flex items-center gap-4 rounded-3xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-[#111418]">{content}</div>;
            })}
          </div>

          <div className="mt-8 rounded-3xl bg-[#1d1d1f] p-6 text-white dark:bg-white dark:text-black">
            <p className="text-xs uppercase tracking-[0.25em] opacity-50">Быстрый путь</p>
            <h3 className="mt-3 text-xl font-semibold">Уже знаете, какой продукт нужен?</h3>
            <p className="mt-2 text-sm leading-6 opacity-65">Посмотрите каталог и выберите продукт, который подходит под вашу задачу.</p>
            <Link href="/products" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium">Открыть продукты <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_2px_24px_rgba(0,0,0,0.04)] md:p-8 dark:border-white/10 dark:bg-[#111418] dark:shadow-none">
          <div className="mb-7"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1D4ED8]">Сообщение</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Напишите нам</h2></div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
