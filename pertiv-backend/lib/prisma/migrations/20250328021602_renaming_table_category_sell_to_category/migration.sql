/*
  Warnings:

  - You are about to drop the `CategorySell` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BookCategorySell" DROP CONSTRAINT "BookCategorySell_category_id_fkey";

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());

-- DropTable
DROP TABLE "CategorySell";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "BookCategorySell" ADD CONSTRAINT "BookCategorySell_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
