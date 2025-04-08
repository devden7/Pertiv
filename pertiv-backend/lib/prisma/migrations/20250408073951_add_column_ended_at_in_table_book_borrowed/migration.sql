-- AlterTable
ALTER TABLE "BookBorrowed" ADD COLUMN     "ended_at" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());
