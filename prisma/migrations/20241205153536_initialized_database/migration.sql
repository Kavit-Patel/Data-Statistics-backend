-- CreateTable
CREATE TABLE "data" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "sold" BOOLEAN NOT NULL,
    "dateOfSale" TEXT NOT NULL,

    CONSTRAINT "data_pkey" PRIMARY KEY ("id")
);
