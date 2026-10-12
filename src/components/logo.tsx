"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { CONFIG } from "@/config/app.config";

export enum LogoType {
  main = "MAIN",
  secondary = "SECONDARY",
}

export type LogoSizeType = "sm" | "md" | "lg" | "xl";

interface LogoProps {
  logo?: LogoType;
  size?: LogoSizeType;
}

const dimensions: Record<LogoSizeType, { width: number; height: number }> = {
  sm: { width: 100, height: 100 },
  md: { width: 180, height: 180 },
  lg: { width: 280, height: 280 },
  xl: { width: 800, height: 800 },
};

export function Logo({ logo = LogoType.main, size = "sm" }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const src =
    logo === LogoType.main
      ? isDark
        ? CONFIG.appWhiteLogo
        : CONFIG.appDarkLogo
      : isDark
        ? CONFIG.appLogo
        : CONFIG.appLogo;

  return (
    <Image
      key={src}
      src={src}
      alt={CONFIG.appName}
      width={dimensions[size].width}
      height={dimensions[size].height}
      priority
    />
  );
}