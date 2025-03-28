/*
  Warnings:

  - You are about to drop the `BookCollection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BookCollection" DROP CONSTRAINT "BookCollection_book_id_fkey";

-- DropForeignKey
ALTER TABLE "BookCollection" DROP CONSTRAINT "BookCollection_user_id_fkey";

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());

-- DropTable
DROP TABLE "BookCollection";

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionItem" (
    "collection_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,

    CONSTRAINT "CollectionItem_pkey" PRIMARY KEY ("collection_id","book_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collection_user_id_key" ON "Collection"("user_id");

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionItem" ADD CONSTRAINT "CollectionItem_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionItem" ADD CONSTRAINT "CollectionItem_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "BookBorrowing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
