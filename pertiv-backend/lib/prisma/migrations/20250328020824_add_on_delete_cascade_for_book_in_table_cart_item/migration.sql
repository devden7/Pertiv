-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_book_selling_id_fkey";

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_book_selling_id_fkey" FOREIGN KEY ("book_selling_id") REFERENCES "BookSelling"("id") ON DELETE CASCADE ON UPDATE CASCADE;
