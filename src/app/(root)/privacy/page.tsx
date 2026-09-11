import { PAGES } from "@/config/pages.config";
import Link from "next/link";
export default function PrivacyPage() {
    return (
        <LegalPage
            title="Политика конфиденциальности"
            sections={["Какие данные мы обрабатываем", "Как используются данные", "Хранение и защита", "Ваши права"]}
        />
    );
}

function LegalPage({ title, sections }: { title: string; sections: string[] }) {
    return (
        <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] dark:bg-[#090909] dark:text-white">
            <section className="mx-auto max-w-4xl px-6 py-20 md:px-10 md:py-28">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1D4ED8]">
                    Narsil
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                    {title}
                </h1>
                <p className="mt-5 text-base leading-7 text-black/50 dark:text-white/50">
                    Страница подготовлена как единая точка для юридической информации продукта. Перед публикацией замените этот текст на утверждённую редакцию документа.
                </p>
                <div className="mt-12 space-y-8">
                    {sections.map((s) =>
                        <section key={s}>
                            <h2 className="text-xl font-semibold">
                                {s}
                            </h2>
                            <p className="mt-2 text-sm leading-7 text-black/50 dark:text-white/50">
                                Здесь будет размещена актуальная информация Narsil по этому разделу.
                            </p>
                        </section>)}
                </div>
                <Link href={PAGES.CONTACTS} className="mt-10 inline-flex text-sm font-medium text-[#1D4ED8]">
                    Связаться с нами
                </Link>
            </section>
        </main>
    );
}
