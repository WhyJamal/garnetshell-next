"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MenuItem } from "@/types/header.types"

export type MobileView = "menu" | "profile" | "search";

type UseHeaderMenuProps = {
  menuItems: MenuItem[];
  closeDelay?: number;
};

export function useHeaderMenu({
  menuItems,
  closeDelay = 80,
}: UseHeaderMenuProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>("menu");
  const [activeMobileMenu, setActiveMobileMenu] = useState<string | null>(null);
  const [profilePinned, setProfilePinned] = useState(false);
  const [searchPinned, setSearchPinned] = useState(false);
  const profilePinnedRef = useRef(false);
  const searchPinnedRef = useRef(false);

  const [query, setQuery] = useState("");

  const setProfilePinnedSync = (val: boolean) => {
    profilePinnedRef.current = val;
    setProfilePinned(val);
  };

  const setSearchPinnedSync = (val: boolean) => {
    searchPinnedRef.current = val;
    setSearchPinned(val);
  };

  const unpinAll = useCallback(() => {
    profilePinnedRef.current = false;
    searchPinnedRef.current = false;
    setProfilePinned(false);
    setSearchPinned(false);
  }, []);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, closeDelay);
  }, [clearCloseTimer, closeDelay]);

  const handleMouseEnter = useCallback((label: string) => {
    clearCloseTimer();
    setActiveMenu(label);
  }, [clearCloseTimer]);

  const handleMouseLeave = useCallback(() => {
    scheduleClose();
  }, [scheduleClose]);

  const handleDropdownMouseEnter = useCallback(() => {
    clearCloseTimer();
  }, [clearCloseTimer]);

  const handleDropdownMouseLeave = useCallback(() => {
    scheduleClose();
  }, [scheduleClose]);

  // Nav
  const onNavEnter = useCallback((label: string) => {
    unpinAll();
    handleMouseEnter(label);
  }, [unpinAll, handleMouseEnter]);

  const onNavLeave = useCallback(() => {
    if (!profilePinnedRef.current && !searchPinnedRef.current) {
      handleMouseLeave();
    }
  }, [handleMouseLeave]);

  // Profile
  const onProfileClick = useCallback(() => {
    if (profilePinnedRef.current) {
      setProfilePinnedSync(false);
      handleMouseLeave();
    } else {
      setSearchPinnedSync(false);
      setProfilePinnedSync(true);
      handleMouseEnter("profile");
    }
  }, [handleMouseEnter, handleMouseLeave]);

  // Search
  const onSearchClick = useCallback(() => {
    if (searchPinnedRef.current) {
      setSearchPinnedSync(false);
      handleMouseLeave();
    } else {
      setProfilePinnedSync(false);
      setSearchPinnedSync(true);
      handleMouseEnter("search");
    }
  }, [handleMouseEnter, handleMouseLeave]);

  // Dropdown (nav hover panel)
  const onDropdownEnter = useCallback(() => {
    handleDropdownMouseEnter();
  }, [handleDropdownMouseEnter]);

  const onDropdownLeave = useCallback(() => {
      unpinAll();
      handleDropdownMouseLeave();
  }, [unpinAll, handleDropdownMouseLeave]);

  // Search overlay
  const onSearchOverlayEnter = useCallback(() => {
    handleDropdownMouseEnter();
  }, [handleDropdownMouseEnter]);

  const onSearchOverlayLeave = useCallback(() => {
    // if (!searchPinnedRef.current) {
      unpinAll();
      handleDropdownMouseLeave();
    // }
  }, [unpinAll, handleDropdownMouseLeave]);

  // Mobile
  const openMobile = useCallback((view: MobileView = "menu") => {
    setMobileView(view);
    setActiveMobileMenu(null);
    setMobileOpen(true);
    unpinAll();
  }, [unpinAll]);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setActiveMobileMenu(null);
  }, []);

  // Tap on hamburger / profile / search on phones: same view -> close, other view -> switch
  const toggleMobile = useCallback((view: MobileView) => {
    if (mobileOpen && mobileView === view) {
      closeMobile();
    } else {
      openMobile(view);
    }
  }, [mobileOpen, mobileView, openMobile, closeMobile]);

  const openMobileMenu = useCallback((label: string) => {
    setActiveMobileMenu(label);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setActiveMobileMenu(null);
  }, []);

  const closeAll = useCallback(() => {
    clearCloseTimer();
    unpinAll();
    setActiveMenu(null);
    setMobileOpen(false);
    setActiveMobileMenu(null);
  }, [clearCloseTimer, unpinAll]);

  const activeItem = useMemo(() => {
    return menuItems.find((m) => m.label === activeMenu) ?? null;
  }, [menuItems, activeMenu]);

  const activeMobileItem = useMemo(() => {
    return menuItems.find((m) => m.label === activeMobileMenu) ?? null;
  }, [menuItems, activeMobileMenu]);

  useEffect(() => {
    return () => { clearCloseTimer(); };
  }, [clearCloseTimer]);

  return {
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

    openMobile,
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
  };
}