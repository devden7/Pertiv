/*
  Warnings:

  - Added the required column `book_description` to the `ItemBorrowed` table without a default value. This is not possible if the table is not empty.
  - Added the required column `book_title` to the `ItemBorrowed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookBorrowed" ADD COLUMN     "canceled_at" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "ItemBorrowed" ADD COLUMN     "book_description" TEXT NOT NULL,
ADD COLUMN     "book_imageUrl" TEXT,
ADD COLUMN     "book_title" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());
