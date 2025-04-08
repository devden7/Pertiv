/*
  Warnings:

  - A unique constraint covering the columns `[loan_key]` on the table `BookBorrowed` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[returned_key]` on the table `BookBorrowed` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());

-- CreateIndex
CREATE UNIQUE INDEX "BookBorrowed_loan_key_key" ON "BookBorrowed"("loan_key");

-- CreateIndex
CREATE UNIQUE INDEX "BookBorrowed_returned_key_key" ON "BookBorrowed"("returned_key");
