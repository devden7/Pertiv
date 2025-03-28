/*
  Warnings:

  - You are about to drop the column `bookBorrowedItemId` on the `ItemBorrowed` table. All the data in the column will be lost.
  - Added the required column `book_borrowing_id` to the `ItemBorrowed` table without a default value. This is not possible if the table is not empty.
  - Added the required column `borrowed_id` to the `ItemBorrowed` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ItemBorrowed" DROP CONSTRAINT "ItemBorrowed_bookBorrowedItemId_fkey";

-- AlterTable
ALTER TABLE "ItemBorrowed" DROP COLUMN "bookBorrowedItemId",
ADD COLUMN     "book_borrowing_id" TEXT NOT NULL,
ADD COLUMN     "borrowed_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());

-- AddForeignKey
ALTER TABLE "ItemBorrowed" ADD CONSTRAINT "ItemBorrowed_borrowed_id_fkey" FOREIGN KEY ("borrowed_id") REFERENCES "BookBorrowed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
