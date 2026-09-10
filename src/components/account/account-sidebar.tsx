"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronRight,
  User,
  Shield,
  Building2,
  FolderOpen,
  Menu,
  X,
} from "lucide-react";
import { PAGES } from "@/config/pages.config";

type SidebarUser = {
  name: string | null;
  email: string | null;
};

type SidebarOrganization = {
  name: string;
  slug: string;
} | null;

const navItems = [
  { title: "Аккаунт", href: PAGES.ACCOUNT, icon: User },
  { title: "Безопасность", href: PAGES.ACCOUNT_SECURITY, icon: Shield },
  { title: "Организация", href: PAGES.ACCOUNT_ORGANIZATION, icon: Building2 },
  { title: "Проекты", href: PAGES.ACCOUNT_PROJECTS, icon: FolderOpen },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function initials(name?: string | null, email?: string | null) {
  const source = (name || email || "U").trim();
  const parts = source.split(/\s+/).filter(Boolean);

  const letters = parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "U");

  return letters.join("") || "U";
}

function SidebarContent({
  user,
  organization,
  pathname,
  onClose,
}: {
  user: SidebarUser;
  organization: SidebarOrganization;
  pathname: string | null;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Close button — mobile only */}
      {onClose && (
        <div className="flex items-center justify-between px-5 pt-5 pb-2 md:hidden">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
            Меню
          </span>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-black/50 transition hover:bg-black/10 dark:bg-white/5 dark:text-white/50 dark:hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* User info */}
      <div className="px-5 pt-8 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-gray-700 to-gray-900 text-xl font-semibold text-white shadow-sm dark:from-gray-500 dark:to-gray-800">
            {initials(user.name, user.email)}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold leading-tight text-[#1d1d1f] dark:text-white">
              {user.name || "Без имени"}
            </p>

            <p className="mt-0.5 truncate text-sm text-black/40 dark:text-white/40">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-5 h-px bg-black/5 dark:bg-white/5" />

      {/* Nav */}
      <nav className="mt-3 flex-1 space-y-0.5 px-3">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/account" &&
              pathname?.startsWith(item.href + "/"));

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cx(
                "flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-medium transition",
                active
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-black/65 hover:bg-black/5 hover:text-black dark:text-white/65 dark:hover:bg-white/5 dark:hover:text-white",
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cx(
                    "h-4 w-4 shrink-0",
                    active
                      ? "text-white dark:text-black"
                      : "text-black/40 dark:text-white/40",
                  )}
                />

                {item.title}
              </div>

              <ChevronRight
                className={cx(
                  "h-3.5 w-3.5 shrink-0",
                  active
                    ? "text-white/60 dark:text-black/50"
                    : "text-black/20 dark:text-white/20",
                )}
              />
            </Link>
          );
        })}
      </nav>

      {/* Organization — bottom of sidebar */}
      {organization && (
        <div className="mx-5 mb-6 mt-4">
          <div className="mb-4 h-px bg-black/5 dark:bg-white/5" />

          <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/30 dark:text-white/30">
            Организация
          </p>

          <div className="px-1">
            <p className="truncate text-sm font-semibold text-[#1d1d1f] dark:text-white">
              {organization.name}
            </p>

            <p className="mt-0.5 text-xs text-black/40 dark:text-white/40">
              @{organization.slug}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function AccountSidebar({
  user,
  organization,
}: {
  user: SidebarUser;
  organization: SidebarOrganization;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeTitle =
    navItems.find(
      (i) =>
        i.href === pathname ||
        (i.href !== "/account" && pathname?.startsWith(i.href + "/")),
    )?.title ?? "Аккаунт";

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-10 right-0 left-0 z-40 flex items-center justify-between border-b border-black/5 bg-white/90 px-5 py-4 backdrop-blur dark:border-white/5 dark:bg-[#0b0d10]/90 md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-gray-700 to-gray-900 text-xs font-semibold text-white dark:from-gray-500 dark:to-gray-800">
            {initials(user.name, user.email)}
          </div>

          <span className="text-sm font-semibold text-[#1d1d1f] dark:text-white">
            {activeTitle}
          </span>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-black/60 transition hover:bg-black/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* Mobile full-screen overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/60"
            onClick={() => setMobileOpen(false)}
          />

          <div className="absolute inset-0 overflow-y-auto bg-white dark:bg-[#0b0d10]">
            <SidebarContent
              user={user}
              organization={organization}
              pathname={pathname}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
        <aside className="sticky top-10 hidden h-[calc(100vh-2.5rem)] w-64 shrink-0 overflow-hidden border-r border-black/5 bg-white/90 backdrop-blur dark:border-white/5 dark:bg-[#0b0d10]/90 md:block">        
        <SidebarContent
          user={user}
          organization={organization}
          pathname={pathname}
        />
      </aside>
    </>
  );
}
