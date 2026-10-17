"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronLeft, Menu, Search, X } from "lucide-react";
import { MenuItem } from "@/types/header.types";
import type { MobileView } from "@/components/hooks/use-header-menu";
import { QUICK_LINKS, SEARCH_ITEMS } from "./search-overlay";

interface MobileMenuProps {
    open: boolean;
    view: MobileView;
    query: string;
    onQueryChange: (val: string) => void;
    menuItems: MenuItem[];
    activeMobileMenu: string | null;
    activeMobileItem: MenuItem | null;
    onClose: () => void;
    onOpenMenu: (label: string) => void;
    onCloseMenu: () => void;
    onLinkClick?: () => void;
}

function LinkColumns({ item, onLinkClick }: { item: MenuItem; onLinkClick?: () => void }) {
    return (
        <div className="flex flex-col pb-4">
            {item.columns.map((col) => (
                <div key={col.title} className="px-10 py-3">
                    <p className="text-sm text-gray-500 mb-2">{col.title}</p>
                    {col.links.map((link) => (
                        <Link
                            key={link.title}
                            href={link.href}
                            onClick={onLinkClick}
                            className="block py-1 text-md font-medium hover:text-gray-500 transition-colors"
                        >
                            {link.title}
                        </Link>
                    ))}
                </div>
            ))}
        </div>
    );
}

function MobileSearch({
    query,
    onQueryChange,
    onLinkClick,
}: {
    query: string;
    onQueryChange: (val: string) => void;
    onLinkClick?: () => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        const t = setTimeout(() => inputRef.current?.focus(), 350);
        return () => clearTimeout(t);
    }, []);

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
        <div className="px-6 pb-6">
            <div className="flex items-center gap-3 border-b border-[rgba(0,0,0,0.1)] dark:border-white/15" style={{ height: "52px" }}>
                <Search size={18} className="shrink-0 text-[#6e6e73] dark:text-[#f5f5f7]" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Поиск"
                    className="flex-1 min-w-0 bg-transparent outline-none text-[19px] text-[#1d1d1f] placeholder:text-[#6e6e73] dark:text-[#f5f5f7]"
                />
                {query && (
                    <button
                        onClick={() => onQueryChange("")}
                        className="shrink-0 text-[#6e6e73] dark:text-[#f5f5f7]"
                        aria-label="Clear"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            <div className="pt-6">
                <p className="text-[#6e6e73] mb-4" style={{ fontSize: "12px" }}>
                    {query.trim() ? "Результаты поиска" : "Быстрые ссылки"}
                </p>
                <ul className="space-y-1">
                    {(filtered ?? QUICK_LINKS).map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                onClick={handleSelect}
                                className="flex items-center gap-3 text-[#1d1d1f] hover:text-[#6e6e73] transition-colors py-1.5 dark:text-[#f5f5f7]"
                                style={{ fontSize: "17px" }}
                            >
                                {filtered ? (
                                    <Search size={14} className="text-[#6e6e73] shrink-0 dark:text-[#f5f5f7]" />
                                ) : (
                                    <ArrowRight size={14} className="text-[#6e6e73] shrink-0 dark:text-[#f5f5f7]" />
                                )}
                                {item.title}
                                {filtered && (
                                    <span className="text-[#6e6e73] dark:text-[#a0a0a4]" style={{ fontSize: "12px" }}>
                                        {item.group}
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                    {filtered && filtered.length === 0 && (
                        <li className="text-[#6e6e73] py-1 dark:text-[#f5f5f7]" style={{ fontSize: "17px" }}>
                            Нет результатов для &ldquo;{query}&rdquo;
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default function MobileMenu({
    open,
    view,
    query,
    onQueryChange,
    menuItems,
    activeMobileMenu,
    activeMobileItem,
    onClose,
    onOpenMenu,
    onCloseMenu,
    onLinkClick,
}: MobileMenuProps) {
    // keep mounted while the closing animation plays
    const [rendered, setRendered] = useState(open);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        if (open) {
            setRendered(true);
            const raf = requestAnimationFrame(() => setShown(true));
            return () => cancelAnimationFrame(raf);
        }
        setShown(false);
        const t = setTimeout(() => setRendered(false), 280);
        return () => clearTimeout(t);
    }, [open]);

    // lock page scroll while the full-screen panel is open
    useEffect(() => {
        if (!rendered) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [rendered]);

    // Esc closes the panel
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    const profileItem = menuItems.find((m) => m.label === "profile") ?? null;

    if (!rendered) return null;

    return (
        <>
        <div
            className="md:hidden fixed inset-0 z-[60] h-dvh bg-white dark:bg-black flex flex-col overflow-hidden"
            style={{
                animation: open
                    ? "slideDown 0.3s cubic-bezier(0.4,0,0.2,1)"
                    : "slideUp 0.28s cubic-bezier(0.4,0,0.2,1) forwards",
            }}
        >
            {/* spacer: room for the fixed X button */}
            <div className="shrink-0 w-full" style={{ height: "44px" }} />

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(0);     opacity: 1; }
                    to   { transform: translateY(-100%); opacity: 0; }
                }
            `}</style>

            {view === "menu" && (
                <>
                    <div className="px-4 py-2 shrink-0 h-11">
                        <button
                            onClick={onCloseMenu}
                            className={`transition-opacity duration-200 text-left ${
                                activeMobileMenu ? "opacity-100" : "opacity-0 pointer-events-none"
                            }`}
                            aria-label="Back"
                        >
                            <ChevronLeft className="text-gray-600 dark:text-white/90" />
                        </button>
                    </div>

                    <div className="relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                        <div
                            className={`transition-transform duration-300 ease-in-out ${
                                activeMobileMenu ? "-translate-x-full" : "translate-x-0"
                            }`}
                        >
                            <div className="flex flex-col pb-4">
                                {menuItems.map((item) =>
                                    item.label !== "profile" && item.label !== "search" && (
                                        <button
                                            key={item.label}
                                            onClick={() => onOpenMenu(item.label)}
                                            className="text-left px-10 py-3 font-bold transition-colors"
                                        >
                                            {item.label}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        <div
                            className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
                                activeMobileMenu ? "translate-x-0" : "translate-x-full"
                            }`}
                        >
                            {activeMobileItem && <LinkColumns item={activeMobileItem} onLinkClick={onLinkClick} />}
                        </div>
                    </div>
                </>
            )}

            {view === "profile" && (
                <div className="flex-1 min-h-0 overflow-y-auto pt-4">
                    {profileItem && <LinkColumns item={profileItem} onLinkClick={onLinkClick} />}
                </div>
            )}

            {view === "search" && (
                <div className="flex-1 min-h-0 overflow-y-auto pt-2">
                    <MobileSearch query={query} onQueryChange={onQueryChange} onLinkClick={onLinkClick} />
                </div>
            )}
        </div>

        {/* X stays in place (does not slide) — only morphs from the hamburger */}
        <div className="md:hidden fixed inset-x-0 top-0 z-[70] pointer-events-none" style={{ height: "44px" }}>
            <div className="max-w-5xl mx-auto h-full flex items-center justify-end px-4">
                <button
                    className="relative size-6 pointer-events-auto"
                    onClick={onClose}
                    aria-label="Close menu"
                >
                    <Menu
                        className={`absolute inset-0 text-gray-600 dark:text-white/90 transition-all duration-300 ${
                            shown ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
                        }`}
                    />
                    <X
                        className={`absolute inset-0 text-gray-600 dark:text-white/90 transition-all duration-300 ${
                            shown ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
                        }`}
                    />
                </button>
            </div>
        </div>
        </>
    );
}
