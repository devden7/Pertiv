-- DropForeignKey
ALTER TABLE "BookSelling" DROP CONSTRAINT "BookSelling_user_id_fkey";

-- AlterTable
ALTER TABLE "BookSelling" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());

-- AddForeignKey
ALTER TABLE "BookSelling" ADD CONSTRAINT "BookSelling_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
