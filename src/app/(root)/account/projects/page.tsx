import Image from "next/image";
import Link from "next/link";
import {
  deleteProjectAction,
  getAccountWorkspaceAction,
} from "@/actions/account.actions";
import { enterExternalAppAction } from "@/actions/purchase.action";

export const dynamic = "force-dynamic";

function formatDate(value?: string | Date | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

const statusLabel: Record<string, string> = {
  PLANNING: "Планируется",
  ACTIVE: "Активен",
  ON_HOLD: "На паузе",
  DONE: "Завершён",
  ARCHIVED: "В архиве",
};

const statusColor: Record<string, string> = {
  PLANNING: "bg-blue-100 text-blue-700",
  ACTIVE: "bg-emerald-100 text-emerald-700",
  ON_HOLD: "bg-amber-100 text-amber-700",
  DONE: "bg-gray-100 text-gray-700",
  ARCHIVED: "bg-red-100 text-red-700",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ purchased?: string }>;
}) {
  const workspace = await getAccountWorkspaceAction();
  const organization = workspace.organization;
  const { purchased } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <header className="space-y-1">
        <p className="text-xs font-semibold tracking-[0.22em] text-black/35 uppercase">
          Проекты
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
          {organization ? "Ваши проекты" : "Создайте организацию"}
        </h1>
      </header>

      {purchased && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
          Продукт подключён и появился в списке ниже.
        </div>
      )}

      <div className="h-px bg-black/5" />

      {!organization ? (
        <div className="space-y-3">
          <p className="text-sm text-black/45">
            Сначала создайте организацию, чтобы начать вести проекты.
          </p>
          <Link
            href="/account/organization"
            className="inline-flex rounded-full bg-[#1d1d1f] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black/80"
          >
            Создать организацию
          </Link>
        </div>
      ) : (
        <>
          {/* Project list */}
          {organization.projects.length > 0 ? (
            <section className="space-y-3">
              {organization.projects.map((project) => (
                <article
                  key={project.id}
                  className="flex items-center gap-4 rounded-2xl bg-white border border-black/5 px-4 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                >
                  {/* Product image thumbnail */}
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#e8e8ed]">
                    {project.product?.image ? (
                      <Image
                        src={project.product.image}
                        alt={project.product.imageAlt || project.product.title}
                        fill
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-lg font-semibold text-black/20">
                        {project.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-semibold text-[#1d1d1f] leading-tight">
                          {project.name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-black/40">
                          {project.product?.title}
                          {project.pricingPlan ? ` · ${project.pricingPlan.name}` : ""}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          statusColor[project.status] ?? "bg-black/5 text-black/50"
                        }`}
                      >
                        {statusLabel[project.status] ?? project.status}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-black/35">
                        {formatDate(project.dueDate) ? `Дедлайн: ${formatDate(project.dueDate)}` : "Без дедлайна"}
                      </span>
                      <div className="flex items-center gap-1">
                        {project.externalUserId && project.product?.appSsoUrl && (
                          <form action={enterExternalAppAction}>
                            <input type="hidden" name="projectId" value={project.id} />
                            <button
                              type="submit"
                              className="rounded-full bg-[#1d1d1f] px-3 py-1 text-[11px] font-medium text-white transition hover:bg-black/80"
                            >
                              Войти
                            </button>
                          </form>
                        )}
                        <form action={deleteProjectAction}>
                          <input type="hidden" name="projectId" value={project.id} />
                          <button
                            type="submit"
                            className="rounded-full px-3 py-1 text-[11px] font-medium text-black/40 transition hover:bg-red-50 hover:text-red-500"
                          >
                            Удалить
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-black/40">
                Пока нет подключённых продуктов.
              </p>
              <Link
                href="/products"
                className="inline-flex rounded-full bg-[#1d1d1f] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black/80"
              >
                Выбрать продукт
              </Link>
            </div>
          )}

          <div className="h-px bg-black/5" />
        </>
      )}
    </div>
  );
}
