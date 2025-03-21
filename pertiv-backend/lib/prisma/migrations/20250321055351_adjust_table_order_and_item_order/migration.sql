/*
  Warnings:

  - You are about to drop the column `total_item` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[buy_key]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `book_description` to the `ItemOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ItemOrder" DROP CONSTRAINT "ItemOrder_book_selling_id_fkey";

-- AlterTable
ALTER TABLE "ItemOrder" ADD COLUMN     "book_description" TEXT NOT NULL,
ADD COLUMN     "book_imageUrl" TEXT,
ALTER COLUMN "book_selling_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "total_item",
ADD COLUMN     "canceled_at" TIMESTAMP(3),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ended_at" TIMESTAMP(3),
ALTER COLUMN "buy_key" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_buy_key_key" ON "Order"("buy_key");

-- AddForeignKey
ALTER TABLE "ItemOrder" ADD CONSTRAINT "ItemOrder_book_selling_id_fkey" FOREIGN KEY ("book_selling_id") REFERENCES "BookSelling"("id") ON DELETE SET NULL ON UPDATE CASCADE;
