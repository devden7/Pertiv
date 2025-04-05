-- AlterTable
ALTER TABLE "BookBorrowing" ALTER COLUMN "book_position" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());
