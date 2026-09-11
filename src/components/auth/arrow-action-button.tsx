"use client";

import { Button } from "@/components/ui/button";
import { ArrowBigRight, Loader2 } from "lucide-react";

type ArrowActionButtonProps = {
  onClick?: () => void;
  loading?: boolean;
  className: string;
  variant?: "default" | "outline";
  type?: "button" | "submit";
};

export function ArrowActionButton({
  onClick,
  loading = false,
  className,
  variant = "default",
  type = "button",
}: ArrowActionButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      size="icon"
      variant={variant}
      className={className}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <ArrowBigRight
          fill="currentColor"
          className="h-5 w-5 text-neutral-700 dark:text-white"
        />
      )}
    </Button>
  );
}

