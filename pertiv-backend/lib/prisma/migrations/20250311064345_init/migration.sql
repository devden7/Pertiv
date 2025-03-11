-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "role" TEXT NOT NULL,
    "image" TEXT,
    "is_penalty" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publisher" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Publisher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Writer" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Writer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategorySell" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "CategorySell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookCategorySell" (
    "book_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "BookCategorySell_pkey" PRIMARY KEY ("book_id","category_id")
);

-- CreateTable
CREATE TABLE "CategoryBorrow" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "CategoryBorrow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookCategoryBorrow" (
    "book_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "BookCategoryBorrow_pkey" PRIMARY KEY ("book_id","category_id")
);

-- CreateTable
CREATE TABLE "BookSelling" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "publisher_id" TEXT NOT NULL,
    "writer_id" TEXT NOT NULL,

    CONSTRAINT "BookSelling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "quantity" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "book_selling_id" TEXT NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("user_id","book_selling_id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "buy_key" VARCHAR(50) NOT NULL,
    "buy_handled_by" TEXT NOT NULL,
    "buy_date" TIMESTAMP(3),
    "total_price" INTEGER NOT NULL,
    "total_item" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemOrder" (
    "id" TEXT NOT NULL,
    "book_title" VARCHAR(255) NOT NULL,
    "book_price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "order_id" TEXT NOT NULL,
    "book_selling_id" TEXT NOT NULL,

    CONSTRAINT "ItemOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookCollection" (
    "user_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,

    CONSTRAINT "BookCollection_pkey" PRIMARY KEY ("user_id","book_id")
);

-- CreateTable
CREATE TABLE "BookBorrowing" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "book_position" CHAR(10) NOT NULL,
    "language" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "is_member" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "publisher_id" TEXT NOT NULL,
    "writer_id" TEXT NOT NULL,

    CONSTRAINT "BookBorrowing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookBorrowed" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "loan_key" VARCHAR(50) NOT NULL,
    "loan_handled_by" TEXT NOT NULL,
    "loan_date" TIMESTAMP(3) NOT NULL,
    "returned_key" VARCHAR(50),
    "return_handled_by" TEXT,
    "date_returned" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "BookBorrowed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemBorrowed" (
    "id" TEXT NOT NULL,
    "bookBorrowedItemId" TEXT NOT NULL,

    CONSTRAINT "ItemBorrowed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_user_id_key" ON "Membership"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "BookSelling_title_key" ON "BookSelling"("title");

-- CreateIndex
CREATE UNIQUE INDEX "BookBorrowing_title_key" ON "BookBorrowing"("title");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCategorySell" ADD CONSTRAINT "BookCategorySell_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "BookSelling"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCategorySell" ADD CONSTRAINT "BookCategorySell_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "CategorySell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCategoryBorrow" ADD CONSTRAINT "BookCategoryBorrow_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "BookBorrowing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCategoryBorrow" ADD CONSTRAINT "BookCategoryBorrow_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "CategoryBorrow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookSelling" ADD CONSTRAINT "BookSelling_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookSelling" ADD CONSTRAINT "BookSelling_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookSelling" ADD CONSTRAINT "BookSelling_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "Writer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_book_selling_id_fkey" FOREIGN KEY ("book_selling_id") REFERENCES "BookSelling"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOrder" ADD CONSTRAINT "ItemOrder_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOrder" ADD CONSTRAINT "ItemOrder_book_selling_id_fkey" FOREIGN KEY ("book_selling_id") REFERENCES "BookSelling"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCollection" ADD CONSTRAINT "BookCollection_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "BookBorrowing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCollection" ADD CONSTRAINT "BookCollection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookBorrowing" ADD CONSTRAINT "BookBorrowing_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookBorrowing" ADD CONSTRAINT "BookBorrowing_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookBorrowing" ADD CONSTRAINT "BookBorrowing_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "Writer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookBorrowed" ADD CONSTRAINT "BookBorrowed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemBorrowed" ADD CONSTRAINT "ItemBorrowed_bookBorrowedItemId_fkey" FOREIGN KEY ("bookBorrowedItemId") REFERENCES "BookBorrowed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
