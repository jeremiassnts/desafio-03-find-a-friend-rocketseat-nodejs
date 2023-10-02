-- CreateEnum
CREATE TYPE "AGE" AS ENUM ('Filhote', 'Adulto', 'Idoso');

-- CreateEnum
CREATE TYPE "SIZE" AS ENUM ('Pequenino', 'Medio', 'Grande');

-- CreateEnum
CREATE TYPE "ENERGY" AS ENUM ('Baixissima', 'Baixa', 'Medio', 'Grande', 'Altissima');

-- CreateEnum
CREATE TYPE "INDEPENDENCY" AS ENUM ('Baixa', 'Media', 'Alta');

-- CreateEnum
CREATE TYPE "AMBIENT" AS ENUM ('Pequeno', 'Medio', 'Grande');

-- CreateTable
CREATE TABLE "pets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "about" VARCHAR(300) NOT NULL,
    "age" "AGE" NOT NULL,
    "size" "SIZE" NOT NULL,
    "energy" "ENERGY" NOT NULL,
    "independency" "INDEPENDENCY" NOT NULL,
    "ambient" "AMBIENT" NOT NULL,
    "requirements" TEXT[],

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photos" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "pet_id" TEXT NOT NULL,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
