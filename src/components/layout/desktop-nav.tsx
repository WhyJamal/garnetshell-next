"use client";

import { MenuItem } from "@/types/header.types";

interface DesktopNavProps {
    menuItems: MenuItem[];
    activeItem: MenuItem | null;
    onMouseEnter: (label: string) => void;
    onMouseLeave: () => void;
}

export default function DesktopNav({
    menuItems,
    activeItem,
    onMouseEnter,
    onMouseLeave,
}: DesktopNavProps) {
    return (
        <div className="hidden md:flex items-center gap-0 h-full">
            {menuItems.map((item) =>
                item.label !== "profile" && (
                    <button
                        key={item.label}
                        onMouseEnter={() => onMouseEnter(item.label)}
                        onMouseLeave={onMouseLeave}
                        className={`px-4 h-full text-[12px] transition-colors whitespace-nowrap ${
                            activeItem?.label === item.label
                                ? "text-[#1d1d1f] dark:text-[#f5f5f7] dark:hover:text-[#6e6e73]"
                                : activeItem
                                ? "text-[#6e6e73] dark:text-[#f5f5f7] dark:hover:text-[#6e6e73]"
                                : "text-[#1d1d1f] hover:text-[#6e6e73] dark:text-[#f5f5f7] dark:hover:text-[#6e6e73]"
                        }`}
                    >
                        {item.label}
                    </button>
                )
            )}
        </div>
    );
}