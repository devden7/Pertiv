/*
  Warnings:

  - Added the required column `price` to the `BookSelling` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookSelling" ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());
