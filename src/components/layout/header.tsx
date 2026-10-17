"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useHeaderMenu } from "@/components/hooks/use-header-menu";
import { menuItems } from "@config/header.config";
import DesktopNav from "./desktop-nav";
import DropdownMenu from "./dropdown-menu";
import HeaderIcons from "./header-icons";
import MobileMenu from "./mobile-menu";
import SearchOverlay from "./search-overlay";
import Link from "next/link";
import { PAGES } from "@/config/pages.config";
import { Logo } from "../logo";
import { useMobile } from "@hooks/use-mobile";

export default function Header() {

    const { data: session, status } = useSession();
    const isAuthed = status === "authenticated" && !!session?.user;

    const visibleMenuItems = useMemo(() => {
        return menuItems.map((item) => {
            if (item.label !== "profile") return item;

            return {
                ...item,
                columns: item.columns.map((column) => ({
                    ...column,
                    links: column.links.filter(
                        (link) => link.href !== PAGES.SIGN_IN || !isAuthed
                    ),
                })),
            };
        });
    }, [isAuthed]);

    const {
        query,
        setQuery,

        activeMenu,
        activeItem,
        mobileOpen,
        mobileView,
        activeMobileMenu,
        activeMobileItem,
        profilePinned,
        searchPinned,

        closeMobile,
        toggleMobile,
        openMobileMenu,
        closeMobileMenu,
        closeAll,

        onNavEnter,
        onNavLeave,
        onProfileClick,
        onSearchClick,
        onDropdownEnter,
        onDropdownLeave,
        onSearchOverlayEnter,
        onSearchOverlayLeave,
    } = useHeaderMenu({ menuItems: visibleMenuItems, closeDelay: 150 });

    const isMobile = useMobile(767);

    const handleProfileClick = () => (isMobile ? toggleMobile("profile") : onProfileClick());
    const handleSearchClick = () => (isMobile ? toggleMobile("search") : onSearchClick());

    // leaving phone width -> drop the full-screen panel
    useEffect(() => {
        if (!isMobile) closeMobile();
    }, [isMobile, closeMobile]);

    const pathname = usePathname();

    useEffect(() => {
        closeAll();
    }, [pathname, closeAll]);

    return (
        <div className="sticky top-0 z-50">
            <nav
                className="w-full bg-[rgba(255,255,255,0.6)] backdrop-blur-2xl supports-backdrop-filter:bg-[rgba(255,255,255,0.5)] border-b border-[rgba(0,0,0,0.08)] relative z-50 dark:bg-black"
                style={{ height: "44px" }}
            >
                <div className="max-w-5xl mx-auto h-full flex items-center justify-between px-4">
                    <Link
                        href={PAGES.HOME}
                    >
                        <Logo size="sm"/>
                    </Link>

                    <DesktopNav
                        menuItems={visibleMenuItems}
                        activeItem={activeItem}
                        onMouseEnter={onNavEnter}
                        onMouseLeave={onNavLeave}
                    />

                    <HeaderIcons
                        profilePinned={profilePinned}
                        searchPinned={searchPinned}
                        mobileOpen={mobileOpen}
                        mobileView={mobileView}
                        onProfileClick={handleProfileClick}
                        onSearchClick={handleSearchClick}
                        onMobileToggle={() => (mobileOpen ? closeMobile() : toggleMobile("menu"))}
                    />
                </div>
            </nav>

            <DropdownMenu
                activeItem={activeItem}
                onMouseEnter={onDropdownEnter}
                onMouseLeave={onDropdownLeave}
                onLinkClick={closeAll}
            />

            <SearchOverlay
                isOpen={searchPinned}
                query={query}
                onQueryChange={setQuery}
                onClose={onSearchClick}
                onMouseEnter={onSearchOverlayEnter}
                onMouseLeave={onSearchOverlayLeave}
                onLinkClick={closeAll}
            />

            <MobileMenu
                open={mobileOpen}
                view={mobileView}
                query={query}
                onQueryChange={setQuery}
                menuItems={visibleMenuItems}
                activeMobileMenu={activeMobileMenu}
                activeMobileItem={activeMobileItem}
                onClose={closeMobile}
                onOpenMenu={openMobileMenu}
                onCloseMenu={closeMobileMenu}
                onLinkClick={closeAll}
            />

        </div>
    );
}