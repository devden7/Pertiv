-- AlterTable
ALTER TABLE "ItemBorrowed" ALTER COLUMN "book_borrowing_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());

-- AddForeignKey
ALTER TABLE "ItemBorrowed" ADD CONSTRAINT "ItemBorrowed_book_borrowing_id_fkey" FOREIGN KEY ("book_borrowing_id") REFERENCES "BookBorrowing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
