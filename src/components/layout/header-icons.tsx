"use client";

import { Menu, Search } from "lucide-react";
import CircleUserRound from "@icons/circle-user-round";
import { ToggleTheme } from "../toggle-theme";

interface HeaderIconsProps {
    profilePinned: boolean;
    searchPinned: boolean;
    onProfileClick: () => void;
    onSearchClick: () => void;
    onMobileOpen: () => void;
}

export default function HeaderIcons({
    profilePinned,
    searchPinned,
    onProfileClick,
    onSearchClick,
    onMobileOpen,
}: HeaderIconsProps) {
    return (
        <div className="flex items-center gap-4 text-[#4a5565] dark:text-white/90">
            <ToggleTheme />

            <button
                onClick={onSearchClick}
                aria-label="Open search"
                className={`cursor-pointer transition-colors ${
                    searchPinned ? "text-[#1d1d1f] dark:text-[#f5f5f7]" : "hover:text-[#1d1d1f] dark:hover:text-[#6e6e73]"
                }`}
            >
                <Search size={18} />
            </button>

            <button
                onClick={onProfileClick}
                aria-label="Профиль"
                className={`cursor-pointer transition-colors ${
                    profilePinned ? "text-[#1d1d1f] dark:text-[#f5f5f7]" : "hover:text-[#1d1d1f] dark:hover:text-[#6e6e73]"
                }`}
            >
                <CircleUserRound size={20}/>
            </button>

            <button
                className="md:hidden"
                onClick={onMobileOpen}
                aria-label="Open menu"
            >
                <Menu className="text-gray-600 dark:text-white/90" />
            </button>
        </div>
    );
}