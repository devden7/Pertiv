/*
  Warnings:

  - You are about to drop the column `is_penalty` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());

-- AlterTable
ALTER TABLE "User" DROP COLUMN "is_penalty";

-- CreateTable
CREATE TABLE "Penalty" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" INTEGER,
    "start_date" TIMESTAMPTZ NOT NULL,
    "end_date" TIMESTAMPTZ NOT NULL,
    "borrowed_id" TEXT NOT NULL,

    CONSTRAINT "Penalty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Penalty_borrowed_id_key" ON "Penalty"("borrowed_id");

-- AddForeignKey
ALTER TABLE "Penalty" ADD CONSTRAINT "Penalty_borrowed_id_fkey" FOREIGN KEY ("borrowed_id") REFERENCES "BookBorrowed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
