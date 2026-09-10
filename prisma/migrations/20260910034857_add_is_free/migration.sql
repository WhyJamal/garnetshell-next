-- AlterTable
ALTER TABLE "Project" ADD COLUMN "externalOrgId" TEXT;
ALTER TABLE "Project" ADD COLUMN "externalUserId" TEXT;
ALTER TABLE "Project" ADD COLUMN "provisionedAt" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "appProvisionUrl" TEXT,
    "appSsoUrl" TEXT,
    "themeFrom" TEXT NOT NULL DEFAULT '#ffffff',
    "themeVia" TEXT NOT NULL DEFAULT '#f8fafc',
    "themeTo" TEXT NOT NULL DEFAULT '#e2e8f0',
    "glow1" TEXT NOT NULL DEFAULT 'bg-white/20',
    "glow2" TEXT NOT NULL DEFAULT 'bg-white/10',
    "solutionSection" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("badge", "createdAt", "description", "featured", "glow1", "glow2", "id", "image", "imageAlt", "slug", "solutionSection", "subtitle", "themeFrom", "themeTo", "themeVia", "title", "updatedAt") SELECT "badge", "createdAt", "description", "featured", "glow1", "glow2", "id", "image", "imageAlt", "slug", "solutionSection", "subtitle", "themeFrom", "themeTo", "themeVia", "title", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
