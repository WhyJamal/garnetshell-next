"use client";

import Link from "next/link";
import { ChevronLeft, X } from "lucide-react";
import { MenuItem } from "@/types/header.types";

interface MobileMenuProps {
    menuItems: MenuItem[];
    activeMobileMenu: string | null;
    activeMobileItem: MenuItem | null;
    onClose: () => void;
    onOpenMenu: (label: string) => void;
    onCloseMenu: () => void;
    onLinkClick?: () => void;
}

export default function MobileMenu({
    menuItems,
    activeMobileMenu,
    activeMobileItem,
    onClose,
    onOpenMenu,
    onCloseMenu,
    onLinkClick,
}: MobileMenuProps) {
    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.2)] backdrop-blur-sm animate-[fadeIn_0.4s_ease]"
                style={{ top: "44px" }}
                onClick={onClose}
            />

            <div
                className="fixed inset-0 z-50 h-dvh bg-white dark:bg-black flex flex-col overflow-hidden"
            >
                <div className="flex items-center justify-between px-4 py-2 shrink-0">
                    <button
                        onClick={onCloseMenu}
                        className={`transition-opacity duration-200 text-left ${
                            activeMobileMenu ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                        aria-label="Back"
                    >
                        <ChevronLeft className="text-gray-600" />
                    </button>

                    <button onClick={onClose} aria-label="Close menu">
                        <X className="text-gray-600" />
                    </button>
                </div>

                <div className="relative flex-1 min-h-0 overflow-hidden animate-[slideDown_0.3s_cubic-bezier(0.4,0,0.2,1)]" style={{ overflowY: "auto" }}>

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
                        {activeMobileItem && (
                            <div className="flex flex-col pb-4">
                                {activeMobileItem.columns.map((col) => (
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
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideDown {
                    from { transform: translateY(-100%); opacity: 0; }
                    to   { transform: translateY(0);     opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
            `}</style>
        </>
    );
}