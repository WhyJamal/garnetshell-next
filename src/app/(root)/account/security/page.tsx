import { changePasswordAction } from "@/actions/account.actions";

export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <header className="space-y-1">
        <p className="text-xs font-semibold tracking-[0.22em] text-black/35 uppercase dark:text-white/35">
          Безопасность
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
          Пароль и доступ
        </h1>
        <p className="mt-1 text-sm text-black/40 dark:text-white/40">
          Обновляйте пароль и держите доступ под контролем.
        </p>
      </header>

      <div className="h-px bg-black/5 dark:bg-white/10" />

      <form action={changePasswordAction} className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
            Сменить пароль
          </h2>
          <p className="text-sm text-black/40 dark:text-white/40">Минимум 8 символов.</p>
        </div>

        <div className="space-y-4">
          <Field label="Текущий пароль" name="currentPassword" type="password" />
          <Field label="Новый пароль" name="newPassword" type="password" />
          <Field label="Повторите новый пароль" name="confirmPassword" type="password" />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex rounded-full bg-[#1d1d1f] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            Обновить пароль
          </button>
        </div>
      </form>

      <div className="h-px bg-black/5 dark:bg-white/10" />

      <div className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
          Подсказка
        </h2>
        <p className="max-w-xl text-sm leading-6 text-black/50 dark:text-white/50">
          Если пароль потерян, используйте восстановление через email.
          Сейчас здесь минимальный безопасный поток.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type,
}: {
  label: string;
  name: string;
  type: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[#1d1d1f] dark:text-white">{label}</label>
      <input
        name={name}
        type={type}
        className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-[#1d1d1f] outline-none transition placeholder:text-black/30 focus:border-black/25 dark:border-white/10 dark:bg-[#111418] dark:text-white dark:placeholder:text-white/30 dark:focus:border-white/25"
      />
    </div>
  );
}
