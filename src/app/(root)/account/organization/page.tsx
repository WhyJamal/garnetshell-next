import {
  getAccountWorkspaceAction,
} from "@/actions/account.actions";
import { CreateOrganizationForm } from "@/components/account/organization/create-organization-form";
import { OrganizationEditor } from "@/components/account/organization/organization-editor";

export const dynamic = "force-dynamic";

export default async function OrganizationPage() {
  const workspace = await getAccountWorkspaceAction();
  const organization = workspace.organization;

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <header className="space-y-1">
        <p className="text-xs font-semibold tracking-[0.22em] text-black/35 uppercase dark:text-white/35">
          Организация
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
          {organization ? organization.name : "Создать организацию"}
        </h1>
      </header>

      <div className="h-px bg-black/5 dark:bg-white/10" />

      {!organization ? (
        <CreateOrganizationForm />
      ) : (
        <OrganizationEditor
          organization={{
            id: organization.id,
            name: organization.name,
            slug: organization.slug,
            inn: organization.inn ?? null,
            description: organization.description ?? null,
            logo: organization.logo ?? null,
          }}
        />
      )}
    </div>
  );
}
