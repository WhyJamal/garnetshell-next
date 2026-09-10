import { AccountSidebar } from "@/components/account/account-sidebar";
import { getAccountWorkspaceAction } from "@/actions/account.actions";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const workspace = await getAccountWorkspaceAction();

  return (
    <main className="bg-[#f5f5f7] text-[#1d1d1f] transition-colors dark:bg-[#0b0d10] dark:text-white">
      <div className="mx-auto flex">
        <AccountSidebar
          user={{
            name: workspace.user.name,
            email: workspace.user.email,
          }}
          organization={
            workspace.organization
              ? {
                  name: workspace.organization.name,
                  slug: workspace.organization.slug,
                }
              : null
          }
        />

        {/* Mobile top bar spacer */}
        <section className="flex-1 px-5 pt-20 pb-6 md:px-8 md:pt-10 lg:px-12 lg:py-10">
          {children}
        </section>
      </div>
    </main>
  );
}
