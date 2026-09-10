"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { updateProfileAction } from "@/actions/account.actions";

type ProfileFormProps = {
  name: string;
  email: string;
  bio: string;
};

export function ProfileForm({ name, email, bio }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
            Личные данные
          </h2>

          <p className="text-sm text-black/40 dark:text-white/40">
            {isEditing
              ? "Изменения применяются сразу после сохранения."
              : "Нажмите «Изменить», чтобы обновить данные."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing((prev) => !prev)}
          className="inline-flex shrink-0 rounded-full bg-black/5 px-4 py-2 text-sm font-medium text-[#1d1d1f] transition hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          {isEditing ? "Отмена" : "Изменить"}
        </button>
      </div>

      <AnimatePresence initial={false} mode="wait">
        {isEditing ? (
          <motion.form
            key="edit-form"
            action={async (formData) => {
              await updateProfileAction(formData);
              setIsEditing(false);
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.35,
              ease: [0.32, 0.72, 0, 1],
            }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-2">
              <Field
                label="Имя"
                name="name"
                defaultValue={name}
              />

              <Field
                label="Email"
                value={email || "—"}
                readOnly
                hint="Email изменить нельзя"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1d1d1f] dark:text-white">
                  О себе
                </label>

                <textarea
                  name="bio"
                  defaultValue={bio}
                  rows={4}
                  placeholder="Пара слов о себе"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[#1d1d1f] outline-none transition placeholder:text-black/30 focus:border-black/25 focus:ring-0 dark:border-white/10 dark:bg-[#111418] dark:text-white dark:placeholder:text-white/30 dark:focus:border-white/25"
                />
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="inline-flex rounded-full bg-[#1d1d1f] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                Сохранить
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="static-view"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.35,
              ease: [0.32, 0.72, 0, 1],
            }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-2">
              <ReadRow
                label="Имя"
                value={name || "Без имени"}
              />

              <ReadRow
                label="Email"
                value={email || "—"}
              />

              <ReadRow
                label="О себе"
                value={bio || "—"}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReadRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-baseline justify-between border-b border-black/5 pb-3 dark:border-white/10">
      <span className="text-sm text-black/40 dark:text-white/40">
        {label}
      </span>

      <span className="text-sm font-medium text-[#1d1d1f] dark:text-white">
        {value}
      </span>
    </div>
  );
}

function Field({
  label,
  defaultValue,
  value,
  name,
  readOnly,
  hint,
}: {
  label: string;
  defaultValue?: string;
  value?: string;
  name?: string;
  readOnly?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-[#1d1d1f] dark:text-white">
          {label}
        </label>

        {hint && (
          <span className="text-xs text-black/35 dark:text-white/30">
            {hint}
          </span>
        )}
      </div>

      <input
        name={name}
        defaultValue={defaultValue}
        value={value}
        readOnly={readOnly}
        className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-[#1d1d1f] outline-none transition focus:border-black/25 read-only:bg-[#f5f5f7] read-only:text-black/45 dark:border-white/10 dark:bg-[#111418] dark:text-white dark:focus:border-white/25 dark:read-only:bg-[#0e1115] dark:read-only:text-white/40"
      />
    </div>
  );
}

