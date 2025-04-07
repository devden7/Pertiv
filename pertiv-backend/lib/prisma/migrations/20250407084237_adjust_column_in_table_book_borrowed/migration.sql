-- AlterTable
ALTER TABLE "BookBorrowed" ALTER COLUMN "loan_key" DROP NOT NULL,
ALTER COLUMN "loan_handled_by" DROP NOT NULL,
ALTER COLUMN "loan_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());
