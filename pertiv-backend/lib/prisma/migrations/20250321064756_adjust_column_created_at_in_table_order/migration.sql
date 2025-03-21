-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "created_at" SET DEFAULT timezone('Asia/Jakarta', now());
