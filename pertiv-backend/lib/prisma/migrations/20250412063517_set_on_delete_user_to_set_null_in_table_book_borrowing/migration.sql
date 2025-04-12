-- DropForeignKey
ALTER TABLE "BookBorrowing" DROP CONSTRAINT "BookBorrowing_user_id_fkey";

-- AlterTable
ALTER TABLE "BookBorrowing" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());

-- AddForeignKey
ALTER TABLE "BookBorrowing" ADD CONSTRAINT "BookBorrowing_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
