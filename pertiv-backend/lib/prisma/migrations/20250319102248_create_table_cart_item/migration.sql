-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "createdAt" SET DEFAULT timezone('Asia/Jakarta', now());

-- CreateTable
CREATE TABLE "CartItem" (
    "quantity" INTEGER NOT NULL,
    "cart_id" TEXT NOT NULL,
    "book_selling_id" TEXT NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("cart_id","book_selling_id")
);

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_book_selling_id_fkey" FOREIGN KEY ("book_selling_id") REFERENCES "BookSelling"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
