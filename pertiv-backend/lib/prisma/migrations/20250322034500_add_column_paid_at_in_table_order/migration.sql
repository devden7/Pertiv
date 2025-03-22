-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paid_at" TIMESTAMP(3);
