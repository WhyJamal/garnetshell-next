import { getAccountWorkspaceAction } from "@/actions/account.actions";
import { ProfileForm } from "@/components/account/profile-form";
import { LogoutButton } from "@/components/account/logout-button";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const workspace = await getAccountWorkspaceAction();

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-[0.22em] text-black/35 uppercase dark:text-white/35">
            Аккаунт
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
            {workspace.user.name || "Профиль"}
          </h1>
        </div>
        <LogoutButton />
      </header>

      <div className="flex items-center gap-5">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-gray-700 to-gray-900 text-3xl font-semibold text-white shadow">
          {initials(workspace.user.name, workspace.user.email)}
        </div>
        <div>
          <p className="text-xl font-semibold text-[#1d1d1f] leading-tight dark:text-white">
            {workspace.user.name || "Без имени"}
          </p>
          <p className="text-sm text-black/45 mt-0.5 dark:text-white/45">{workspace.user.email}</p>
        </div>
      </div>

      <div className="h-px bg-black/5 dark:bg-white/10" />

      <ProfileForm
        name={workspace.user.name ?? ""}
        email={workspace.user.email ?? ""}
        bio={workspace.user.bio ?? ""}
      />
    </div>
  );
}

function initials(name?: string | null, email?: string | null) {
  const source = (name || email || "U").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "U").join("") || "U";
}
