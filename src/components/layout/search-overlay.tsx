"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { menuItems } from "@config/header.config";
import { PAGES } from "@/config/pages.config";

export interface SearchItem {
    title: string;
    href: string;
    group: string;
}

export const SEARCH_ITEMS: SearchItem[] = (() => {
    const seen = new Set<string>();
    const list: SearchItem[] = [];

    const add = (item: SearchItem) => {
        if (seen.has(item.href)) return;
        seen.add(item.href);
        list.push(item);
    };

    for (const menu of menuItems) {
        if (menu.label === "profile") continue;
        for (const col of menu.columns) {
            for (const link of col.links) {
                add({ title: link.title, href: link.href, group: menu.label });
            }
        }
    }

    add({ title: "Политика конфиденциальности", href: PAGES.PRIVACY_POLICY, group: "Компания" });
    add({ title: "Условия использования", href: PAGES.TERMS_OF_SERVICE, group: "Компания" });

    return list;
})();

const QUICK_HREFS: string[] = [PAGES.PRODUCTS, PAGES.PRICING, "/features", PAGES.SUPPORT];

export const QUICK_LINKS: SearchItem[] = SEARCH_ITEMS.filter((i) => QUICK_HREFS.includes(i.href));

interface SearchOverlayProps {
    isOpen: boolean;
    query: string;
    onQueryChange: (val: string) => void;
    onClose: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onLinkClick?: () => void;
}

export default function SearchOverlay({
    isOpen,
    query,
    onQueryChange,
    onClose,
    
    onMouseEnter,
    onMouseLeave,
    onLinkClick
}: SearchOverlayProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            const t = setTimeout(() => inputRef.current?.focus(), 50);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

    const filtered = tokens.length
        ? SEARCH_ITEMS.filter((i) => {
            const text = `${i.title} ${i.group}`.toLowerCase();
            return tokens.every((t) => text.includes(t));
        })
        : null;

    const handleSelect = () => {
        onQueryChange("");
        onLinkClick?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && filtered && filtered.length > 0) {
            router.push(filtered[0].href);
            handleSelect();
        }
    };

    return (
        <>
            <div
                className={`absolute top-11 left-0 w-full transition-all duration-200 ${isOpen
                    ? "opacity-100 pointer-events-auto translate-y-0"
                    : "opacity-0 pointer-events-none -translate-y-1"
                    }`}
                style={{ zIndex: 40 }}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <div className="w-full bg-[rgba(255,255,255,0.92)] backdrop-blur-xl dark:bg-black" style={{ minHeight: "320px", paddingBottom: "48px" }}>
                    <div className="max-w-5xl mx-auto px-4">

                        <div
                            className="flex items-center gap-3 border-b border-[rgba(0,0,0,0.1)]"
                            style={{ height: "52px" }}
                        >
                            <Search size={18} className="shrink-0 text-[#6e6e73] dark:text-[#f5f5f7]" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => onQueryChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Поиск"
                                className="flex-1 bg-transparent outline-none text-[19px] text-[#1d1d1f] placeholder:text-[#6e6e73] dark:text-[#f5f5f7] dark:placeholder:text-[#6e6e73]"
                            />
                            {query && (
                                <button
                                    onClick={() => onQueryChange("")}
                                    className="shrink-0 text-[#6e6e73] hover:text-[#1d1d1f] transition-colors dark:text-[#f5f5f7] dark:hover:text-[#6e6e73]"
                                    aria-label="Clear"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        {!query.trim() && (
                            <div className="pt-6">
                                <p className="text-[#6e6e73] mb-4" style={{ fontSize: "12px" }}>
                                    Быстрые ссылки
                                </p>
                                <ul className="space-y-1">
                                    {QUICK_LINKS.map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                onClick={handleSelect}
                                                className="flex items-center gap-2 text-[#1d1d1f] hover:text-[#6e6e73] transition-colors py-1 dark:text-[#f5f5f7] dark:hover:text-[#6e6e73]"
                                                style={{ fontSize: "17px" }}
                                            >
                                                <ArrowRight size={14} className="text-[#6e6e73] dark:text-[#f5f5f7]" />
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {query.trim() && (
                            <div className="pt-6">
                                <p className="text-[#6e6e73] mb-4" style={{ fontSize: "12px" }}>
                                    Результаты поиска
                                </p>
                                <ul className="space-y-1">
                                    {filtered && filtered.length > 0 ? (
                                        filtered.map((item) => (
                                            <li key={item.href}>
                                                <Link
                                                    href={item.href}
                                                    onClick={handleSelect}
                                                    className="flex items-center gap-3 text-[#1d1d1f] hover:text-[#6e6e73] transition-colors py-1 dark:text-[#f5f5f7] dark:hover:text-[#6e6e73]"
                                                    style={{ fontSize: "17px" }}
                                                >
                                                    <Search size={14} className="text-[#6e6e73] shrink-0 dark:text-[#f5f5f7]" />
                                                    {item.title}
                                                    <span className="text-[#6e6e73] dark:text-[#a0a0a4]" style={{ fontSize: "12px" }}>
                                                        {item.group}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-[#6e6e73] py-1 dark:text-[#f5f5f7]" style={{ fontSize: "17px" }}>
                                            Нет результатов для &ldquo;{query}&rdquo;
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-[rgba(0,0,0,0.2)] backdrop-blur-sm transition-opacity duration-300"
                    style={{ top: "44px" }}
                />
            )}
        </>
    );
}