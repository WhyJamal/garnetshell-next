"use client";

import { Menu, Search, X } from "lucide-react";
import CircleUserRound from "@icons/circle-user-round";
import { ToggleTheme } from "../toggle-theme";
import type { MobileView } from "@/components/hooks/use-header-menu";

interface HeaderIconsProps {
    profilePinned: boolean;
    searchPinned: boolean;
    mobileOpen: boolean;
    mobileView: MobileView;
    onProfileClick: () => void;
    onSearchClick: () => void;
    onMobileToggle: () => void;
}

export default function HeaderIcons({
    profilePinned,
    searchPinned,
    mobileOpen,
    mobileView,
    onProfileClick,
    onSearchClick,
    onMobileToggle,
}: HeaderIconsProps) {
    const searchActive = searchPinned || (mobileOpen && mobileView === "search");
    const profileActive = profilePinned || (mobileOpen && mobileView === "profile");

    return (
        <div className="flex items-center gap-4 text-[#4a5565] dark:text-white/90">
            <ToggleTheme />

            <button
                onClick={onSearchClick}
                aria-label="Open search"
                className={`cursor-pointer transition-colors ${
                    searchActive ? "text-[#1d1d1f] dark:text-[#f5f5f7]" : "hover:text-[#1d1d1f] dark:hover:text-[#6e6e73]"
                }`}
            >
                <Search size={18} />
            </button>

            <button
                onClick={onProfileClick}
                aria-label="Профиль"
                className={`cursor-pointer transition-colors ${
                    profileActive ? "text-[#1d1d1f] dark:text-[#f5f5f7]" : "hover:text-[#1d1d1f] dark:hover:text-[#6e6e73]"
                }`}
            >
                <CircleUserRound size={20}/>
            </button>

            <button
                className="md:hidden relative size-6"
                onClick={onMobileToggle}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
            >
                <Menu
                    className={`absolute inset-0 text-gray-600 dark:text-white/90 transition-all duration-300 ${
                        mobileOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
                    }`}
                />
                <X
                    className={`absolute inset-0 text-gray-600 dark:text-white/90 transition-all duration-300 ${
                        mobileOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
                    }`}
                />
            </button>
        </div>
    );
}
