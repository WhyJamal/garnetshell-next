"use client";

import { createPortal } from "react-dom";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";

export function PurchaseSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <>
      <Button type="submit" disabled={pending} className="w-full rounded-full">
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Оформляем...
          </>
        ) : (
          "Выбрать тариф"
        )}
      </Button>

      {pending &&
        createPortal(
          <div
            className="fixed inset-0 z-100 flex cursor-wait items-center justify-center bg-black/20 backdrop-blur-[2px]"
            aria-busy="true"
            aria-live="polite"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-black/5 bg-white/60 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-black/40">
              <Loader />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}