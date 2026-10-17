/*
  Warnings:

  - A unique constraint covering the columns `[requestId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "requestId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Project_requestId_key" ON "Project"("requestId");
