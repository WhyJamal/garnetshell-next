"use client";

import Link from "next/link";
import { MenuItem } from "@/types/header.types";

interface DropdownMenuProps {
    activeItem: MenuItem | null;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onLinkClick?: () => void;
}

export default function DropdownMenu({
    activeItem,
    onMouseEnter,
    onMouseLeave,
    onLinkClick,
}: DropdownMenuProps) {
    return (
        <>
            <div
                className={`absolute top-11 left-0 w-full transition-all duration-300 ${
                    activeItem
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                style={{ zIndex: 40 }}
            >
                <div
                    className="w-full bg-[rgba(255,255,255,0.92)] backdrop-blur-xl border-b border-[rgba(0,0,0,0.08)] dark:bg-black"
                    style={{ paddingTop: "28px", paddingBottom: "36px" }}
                >
                    <div className="max-w-5xl mx-auto px-10">
                        {activeItem && (
                            <div
                                className="grid gap-8"
                                style={{
                                    gridTemplateColumns: `repeat(${activeItem.columns.length}, 1fr)`,
                                }}
                            >
                                {activeItem.columns.map((col) => (
                                    <div key={col.title}>
                                        <p
                                            className="text-[#6e6e73] mb-3 dark:text-[#a0a0a4]"
                                            style={{ fontSize: "12px" }}
                                        >
                                            {col.title}
                                        </p>
                                        <ul className="space-y-3">
                                            {col.links.map((link) => {
                                                const Icon = link.icon;
                                                return (
                                                    <li key={link.title}>
                                                        <Link
                                                            href={link.href}
                                                            onClick={onLinkClick}
                                                            className="block text-[#1d1d1f] hover:text-[#6e6e73] transition-colors dark:text-[#f5f5f7] dark:hover:text-[#6e6e73]"
                                                            style={{
                                                                fontSize: "17px",
                                                                lineHeight: "1.47",
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {Icon && <Icon size={18} />}
                                                                {link.title}
                                                            </div>
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {activeItem && (
                <div
                    className="fixed inset-0 z-30 bg-[rgba(0,0,0,0.2)] backdrop-blur-sm transition-opacity duration-300"
                    style={{ top: "44px"}}
                />
            )}
        </>
    );
}