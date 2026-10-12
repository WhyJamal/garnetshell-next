import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { FAQ_ITEMS } from "@config/faq.config"
import Link from "next/link";
import { PAGES } from "@/config/pages.config";

function FAQItem({
    item,
    isOpen,
    onToggle,
    index,
}: {
    item: (typeof FAQ_ITEMS)[number];
    isOpen: boolean;
    onToggle: () => void;
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.04, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="border-b border-black/8 last:border-0 dark:border-white/10"
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between py-6 text-left group"
            >
                <span
                    className="text-[17px] font-medium pr-8 transition-colors duration-200"
                    style={{ color: isOpen ? "#0A84FF" : "inherit" }}
                >
                    {item.q}
                </span>
                <div
                    className="shrink-0 h-7 w-7 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                        backgroundColor: isOpen ? "#0A84FF" : "#00000008",
                    }}
                >
                    {isOpen ? (
                        <Minus className="h-3.5 w-3.5 text-white dark:text-black" />
                    ) : (
                        <Plus className="h-3.5 w-3.5 text-black/50 dark:text-white/50" />
                    )}
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-[17px] leading-7 text-black/55 max-w-2xl dark:text-white/55">
                            {item.a}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-2 sm:py-5">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                <div className="mb-16">
                    <p className="text-sm font-medium text-black/40 uppercase tracking-widest mb-4">
                        Вопросы и ответы
                    </p>
                    <h2
                        className="text-5xl sm:text-6xl font-semibold"
                        style={{ letterSpacing: "-0.04em" }}
                    >
                        Часто задаваемые
                        <br />
                        вопросы.
                    </h2>
                </div>

                <div>
                    {FAQ_ITEMS.map((item, i) => (
                        <FAQItem
                            key={i}
                            item={item}
                            index={i}
                            isOpen={openIndex === i}
                            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-16 text-center"
                >
                    <p className="text-black/50 mb-4 dark:text-white/50">Не нашли ответ на свой вопрос?</p>
                    <Link
                        href={PAGES.CONTACTS}
                        className="inline-flex items-center gap-2 rounded-full bg-black dark:bg-white px-6 py-3 text-sm font-medium text-white dark:text-black transition-opacity hover:opacity-75"

                    >

                        Связаться с нами

                    </Link>
                </motion.div>

            </div>
        </section>
    );
}