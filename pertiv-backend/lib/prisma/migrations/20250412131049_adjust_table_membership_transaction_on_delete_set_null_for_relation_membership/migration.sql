-- DropForeignKey
ALTER TABLE "MembershipTransaction" DROP CONSTRAINT "MembershipTransaction_membership_id_fkey";

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());

-- AlterTable
ALTER TABLE "MembershipTransaction" ALTER COLUMN "membership_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "MembershipTransaction" ADD CONSTRAINT "MembershipTransaction_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "Membership"("id") ON DELETE SET NULL ON UPDATE CASCADE;
