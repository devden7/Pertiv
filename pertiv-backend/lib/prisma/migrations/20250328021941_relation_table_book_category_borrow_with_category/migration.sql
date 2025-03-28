/*
  Warnings:

  - You are about to drop the `CategoryBorrow` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BookCategoryBorrow" DROP CONSTRAINT "BookCategoryBorrow_category_id_fkey";

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());

-- DropTable
DROP TABLE "CategoryBorrow";

-- AddForeignKey
ALTER TABLE "BookCategoryBorrow" ADD CONSTRAINT "BookCategoryBorrow_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
