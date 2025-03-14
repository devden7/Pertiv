-- AlterTable
ALTER TABLE "BookBorrowing" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "BookSelling" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());
