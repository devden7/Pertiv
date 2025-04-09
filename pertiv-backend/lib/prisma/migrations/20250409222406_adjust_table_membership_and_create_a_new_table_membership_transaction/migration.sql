/*
  Warnings:

  - You are about to drop the column `end_date` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Membership` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Membership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationDays` to the `Membership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxBorrow` to the `Membership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxReturn` to the `Membership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Membership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Membership` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_user_id_fkey";

-- DropIndex
DROP INDEX "Membership_user_id_key";

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "end_date",
DROP COLUMN "start_date",
DROP COLUMN "type",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "durationDays" INTEGER NOT NULL,
ADD COLUMN     "maxBorrow" INTEGER NOT NULL,
ADD COLUMN     "maxReturn" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "MembershipTransaction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "maxBorrow" INTEGER NOT NULL,
    "maxReturn" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "start_date" TIMESTAMPTZ NOT NULL,
    "end_date" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "membership_id" TEXT NOT NULL,

    CONSTRAINT "MembershipTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Membership_name_key" ON "Membership"("name");

-- AddForeignKey
ALTER TABLE "MembershipTransaction" ADD CONSTRAINT "MembershipTransaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipTransaction" ADD CONSTRAINT "MembershipTransaction_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "Membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
