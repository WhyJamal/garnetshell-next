"use client";

import { useActionState } from "react";
import {
  createOrganizationAction,
  type OrganizationActionState,
} from "@/actions/organization.action";

const initialState: OrganizationActionState = {
  success: false,
};

export function CreateOrganizationForm() {
  const [state, formAction, isPending] = useActionState(
    createOrganizationAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
          Новая организация
        </h2>

        <p className="text-sm text-black/40 dark:text-white/40">
          Заполните основные данные и при желании сразу привяжите продукт.
        </p>
      </div>

      <div className="space-y-4">
        <Field label="Название" name="name" placeholder="Void Studio" />

        <Field label="Инн" name="inn" />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#1d1d1f] dark:text-white">
            Описание
          </label>

          <textarea
            name="description"
            rows={4}
            placeholder="Коротко о компании"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[#1d1d1f] outline-none transition placeholder:text-black/30 focus:border-black/25 dark:border-white/10 dark:bg-[#111418] dark:text-white dark:placeholder:text-white/30 dark:focus:border-white/25"
          />
        </div>
      </div>

      {!state.success && state.message && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {state.message}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex rounded-full bg-[#1d1d1f] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          {isPending ? "Создание..." : "Создать организацию"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[#1d1d1f] dark:text-white">
        {label}
      </label>

      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-[#1d1d1f] outline-none transition placeholder:text-black/30 focus:border-black/25 dark:border-white/10 dark:bg-[#111418] dark:text-white dark:placeholder:text-white/30 dark:focus:border-white/25"
      />
    </div>
  );
}

