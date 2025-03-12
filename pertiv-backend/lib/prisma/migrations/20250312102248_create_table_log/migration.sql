-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT timezone('Asia/Jakarta', now()),

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);
