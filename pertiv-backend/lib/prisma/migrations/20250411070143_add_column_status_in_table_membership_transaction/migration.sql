/*
  Warnings:

  - Added the required column `status` to the `MembershipTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());

-- AlterTable
ALTER TABLE "MembershipTransaction" ADD COLUMN     "status" TEXT NOT NULL;
