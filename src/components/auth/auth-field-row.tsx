"use client";

import type { ChangeEvent, ReactNode } from "react";

import { Input } from "@/components/ui/input";

type AuthFieldRowProps = {
  label: string;
  name?: string;
  error?: string;
  type: "text" | "email" | "password";
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  containerClassName: string;
  inputClassName?: string;
  disabled?: boolean;
  children?: ReactNode;
};

export function AuthFieldRow({
  label,
  name,
  error,
  type,
  value,
  onChange,
  placeholder,
  containerClassName,
  inputClassName = "",
  disabled = false,
  children,
}: AuthFieldRowProps) {
  return (
    <div className={containerClassName}>
      <label className="mb-1 block text-sm text-neutral-500 dark:text-white/45">
        {label}
      </label>

      <Input
        type={type}
        value={value}
        name={name}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          h-10
          border-0
          bg-transparent
          p-0
          text-[22px]
          font-normal
          text-neutral-900
          shadow-none
          outline-none
          placeholder:text-neutral-400
          focus-visible:ring-0
          disabled:cursor-default
          disabled:opacity-100
          dark:bg-transparent
          dark:text-white
          dark:placeholder:text-white/25
          dark:disabled:text-white/70
          dark:disabled:placeholder:text-white/20
          ${inputClassName}
        `}
      />

      {error && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400">
          {error}
        </p>
      )}

      {children}
    </div>
  );
}

