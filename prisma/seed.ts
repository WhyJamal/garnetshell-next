import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "owner@void.app" },
    update: {},
    create: {
      name: "Владелец",
      email: "owner@void.app",
      password,
    },
  });

  const organization = await prisma.organization.upsert({
    where: { slug: "void-studio" },
    update: {},
    create: {
      name: "Void Studio",
      slug: "void-studio",
      ownerId: user.id,
      members: {
        create: {
          user: { connect: { id: user.id } },
          role: "OWNER",
        },
      },
    },
  });

  const products = [
    {
      slug: "vol-mart",
      title: "Vol-mart",
      isFree: true,
      subtitle:
        "Касса, склад и задолженности для магазина — единая система, готовая к работе за несколько минут.",
      badge: "Самый популярный",
      description:
        "Система управления POS-кассой, складским учетом и задолженностями клиентов и поставщиков для магазинов Узбекистана.",
      image: "/images/products/stock-market.webp",
      imageAlt: "Vol-mart — система управления магазином",
      featured: true,
      appProvisionUrl: process.env.VOLMART_PROVISION_URL ?? null,
      appSsoUrl: process.env.VOLMART_SSO_URL ?? null,
      themeFrom: "#ffffff",
      themeVia: "#fff7ed",
      themeTo: "#fef3c7",
      glow1: "bg-yellow-200/40",
      glow2: "bg-orange-200/30",
      solutionSection: {
        badge: "Решение для магазинов",
        title:
          "Полностью контролируйте кассу, склад и задолженности в одной системе",
        description:
          "Отслеживайте продажи, остатки товаров и задолженности клиентов и поставщиков в реальном времени — без бумажной работы и ошибок.",

        media: {
          type: "image",
          src: "/images/products/stock-market.webp",
          alt: "POS-терминал Vol-mart",
        },

        listTitle: "Vol-mart поможет вам:",

        items: [
          {
            text: "Быстро оформлять продажи через POS-кассу и принимать наличные, карты и QR-платежи",
          },
          {
            text: "Контролировать складские остатки и перемещения товаров",
          },
          {
            text: "Вести учет задолженностей клиентов и поставщиков",
          },
        ],

        ctaLabel: "Подробнее",
        ctaHref: "/docs/retail-brief.pdf",
      },
    },
    {
      slug: "team-erp",
      title: "Командный ERP",
      subtitle:
        "Задачи, роли, дедлайны и контроль процессов в одном продукте.",
      badge: "Популярно",
      description:
        "Внутренний продукт для управления проектами, сотрудниками и процессами компании.",
      image: "/images/showcase/photo-1552664730-d307ca884978.webp",
      imageAlt: "Командный ERP",
      featured: false,
      appProvisionUrl: null,
      appSsoUrl: null,
      themeFrom: "#eff6ff",
      themeVia: "#dbeafe",
      themeTo: "#bfdbfe",
      glow1: "bg-blue-200/35",
      glow2: "bg-sky-200/25",
      solutionSection: {
        badge: "Решения для розничной торговли",
        title:
          "Повышение эффективности и роста в розничной торговле с помощью единой цифровой платформы",
        description:
          "Оптимизируйте операции, улучшайте клиентский опыт и принимайте решения на основе данных в реальном времени.",

        media: {
          type: "image",
          src: "/images/products/stock-market.webp",
          alt: "Розничный магазин",
        },

        listTitle: "Решения помогут вам решить следующие задачи:",

        items: [
          {
            text: "Централизация данных о продажах и клиентах",
          },
          {
            text: "Оптимизация управления запасами",
          },
          {
            text: "Автоматизация процессов продаж",
          },
        ],

        ctaLabel: "Читать информационный документ",
        ctaHref: "/docs/retail-brief.pdf",
      },
    },
    {
      slug: "finance-analytics",
      title: "Финансы и аналитика",
      subtitle:
        "Отчеты, бюджеты и прозрачная картина по финансам и эффективности.",
      badge: "Для роста",
      description:
        "Финансовый модуль для руководителей, аналитиков и операционных команд.",
      image: "/images/showcase/photo-1551288049-bebda4e38f71.webp",
      imageAlt: "Финансы и аналитика",
      featured: false,
      appProvisionUrl: null,
      appSsoUrl: null,
      themeFrom: "#f8fafc",
      themeVia: "#e2e8f0",
      themeTo: "#cbd5e1",
      glow1: "bg-slate-200/40",
      glow2: "bg-zinc-200/25",
      solutionSection: {
        badge: "Решения для розничной торговли",
        title:
          "Повышение эффективности и роста в розничной торговле с помощью единой цифровой платформы",
        description:
          "Оптимизируйте операции, улучшайте клиентский опыт и принимайте решения на основе данных в реальном времени.",

        media: {
          type: "image",
          src: "/images/products/stock-market.webp",
          alt: "Розничный магазин",
        },

        listTitle: "Решения помогут вам решить следующие задачи:",

        items: [
          {
            text: "Централизация данных о продажах и клиентах",
          },
          {
            text: "Оптимизация управления запасами",
          },
          {
            text: "Автоматизация процессов продаж",
          },
        ],

        ctaLabel: "Читать информационный документ",
        ctaHref: "/docs/retail-brief.pdf",
      },
    },
  ] as const;

  const dbProducts = [] as Array<{
    id: string;
    slug: string;
    title: string;
  }>;

  for (const product of products) {
    const item = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        title: product.title,
        subtitle: product.subtitle,
        badge: product.badge,
        description: product.description,
        image: product.image,
        imageAlt: product.imageAlt,
        featured: product.featured,
        themeFrom: product.themeFrom,
        themeVia: product.themeVia,
        themeTo: product.themeTo,
        glow1: product.glow1,
        glow2: product.glow2,
        appProvisionUrl: product.appProvisionUrl,
        appSsoUrl: product.appSsoUrl,
      },
      create: {
        ...product,
      },
      select: { id: true, slug: true, title: true },
    });

    dbProducts.push(item);
  }

  const retail = dbProducts.find((item) => item.slug === "vol-mart");
  const team = dbProducts.find((item) => item.slug === "team-erp");
  const finance = dbProducts.find(
    (item) => item.slug === "finance-analytics"
  );

  if (!retail || !team || !finance) {
    throw new Error("Не удалось создать продукты");
  }

  const retailProject = await prisma.project.upsert({
    where: { slug: "vol-mart-do-koni-1" },
    update: {},
    create: {
      name: "Vol-mart — Магазин №1",
      slug: "vol-mart-do-koni-1",
      description: "Vol-mart запущен для одного магазина.",
      organizationId: organization.id,
      productId: retail.id,
      status: "ACTIVE",
      startsAt: new Date("2026-01-05T00:00:00.000Z"),
      endsAt: new Date("2026-07-01T00:00:00.000Z"),
      dueDate: new Date("2026-06-30T00:00:00.000Z"),
      budget: 250000,
    },
  });

  const teamProject = await prisma.project.upsert({
    where: { slug: "internal-workspace-v2" },
    update: {},
    create: {
      name: "Internal Workspace v2",
      slug: "internal-workspace-v2",
      description: "Обновление внутренней системы для команды.",
      organizationId: organization.id,
      productId: team.id,
      status: "PLANNING",
      startsAt: new Date("2026-02-01T00:00:00.000Z"),
      endsAt: new Date("2026-08-01T00:00:00.000Z"),
      dueDate: new Date("2026-07-20T00:00:00.000Z"),
      budget: 180000,
    },
  });

  await prisma.project.upsert({
    where: { slug: "finance-suite-migration" },
    update: {},
    create: {
      name: "Finance Suite Migration",
      slug: "finance-suite-migration",
      description: "Миграция финансовых отчетов и аналитики.",
      organizationId: organization.id,
      productId: finance.id,
      status: "ON_HOLD",
      startsAt: new Date("2026-03-10T00:00:00.000Z"),
      endsAt: new Date("2026-09-10T00:00:00.000Z"),
      dueDate: new Date("2026-08-15T00:00:00.000Z"),
      budget: 220000,
    },
  });

  await prisma.organizationProduct.createMany({
    data: [
      { organizationId: organization.id, productId: retail.id },
      { organizationId: organization.id, productId: team.id },
      { organizationId: organization.id, productId: finance.id },
    ],
  });

  const pricingPlans = [
    {
      productId: retail.id,
      name: "Стартовый",
      slug: "starter",
      description: "Начальный тариф для одного магазина.",
      price: 199000,
      currency: "UZS",
      billingPeriod: "MONTHLY",
      features: [
        "1 магазин",
        "POS-касса",
        "Остатки на складе",
        "Поддержка по Email",
      ],
      isPopular: false,
      seats: 3,
    },
    {
      productId: retail.id,
      name: "Бизнес",
      slug: "business",
      description: "Для нескольких торговых точек и сотрудников.",
      price: 449000,
      currency: "UZS",
      billingPeriod: "MONTHLY",
      features: [
        "До 5 торговых точек",
        "Задолженности клиентов и поставщиков",
        "Роли и разрешения",
        "Приоритетная поддержка",
      ],
      isPopular: true,
      seats: 15,
    },
    {
      productId: retail.id,
      name: "Сеть",
      slug: "network",
      description: "Полная настройка для сети магазинов.",
      price: 990000,
      currency: "UZS",
      billingPeriod: "MONTHLY",
      features: [
        "Неограниченное количество точек",
        "Все отчеты",
        "Индивидуальная настройка",
        "Поддержка 24/7",
      ],
      isPopular: false,
      seats: 50,
    },
    {
      productId: team.id,
      name: "Команда",
      slug: "team",
      description: "Для рабочих групп и отделов.",
      price: 30000,
      currency: "USD",
      billingPeriod: "MONTHLY",
      features: ["Задачи и дедлайны", "Канбан", "Комментарии"],
      isPopular: true,
      seats: 15,
    },
    {
      productId: team.id,
      name: "Корпоративный проект",
      slug: "enterprise-project",
      description: "Тариф для внедрения в компанию.",
      price: 120000,
      currency: "USD",
      billingPeriod: "MONTHLY",
      features: ["Больше ролей", "Расширенный аудит", "SLA и внедрение"],
      isPopular: false,
      seats: 50,
    },
    {
      productId: finance.id,
      name: "Аналитика",
      slug: "analytics",
      description: "Пакет для контроля финансов.",
      price: 45000,
      currency: "USD",
      billingPeriod: "MONTHLY",
      features: ["Отчеты", "Бюджеты", "Графики"],
      isPopular: true,
      seats: 8,
    },
  ] as const;

  for (const plan of pricingPlans) {
    const existingPlan = await prisma.pricingPlan.findFirst({
      where: {
        productId: plan.productId,
        slug: plan.slug,
      },
    });

    if (existingPlan) {
      await prisma.pricingPlan.update({
        where: { id: existingPlan.id },
        data: {
          name: plan.name,
          description: plan.description,
          price: plan.price,
          currency: plan.currency,
          billingPeriod: plan.billingPeriod,
          features: plan.features,
          isPopular: plan.isPopular,
          seats: plan.seats,
        },
      });
      continue;
    }

    await prisma.pricingPlan.create({
      data: {
        ...plan,
      },
    });
  }

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

