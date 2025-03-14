/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `CategorySell` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());

-- CreateIndex
CREATE UNIQUE INDEX "CategorySell_name_key" ON "CategorySell"("name");
