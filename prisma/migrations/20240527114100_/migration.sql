/*
  Warnings:

  - You are about to alter the column `views` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - Made the column `starting_price` on table `Auctioned_Property` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Auctioned_Property" ALTER COLUMN "starting_price" SET NOT NULL;

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "description" TEXT,
ALTER COLUMN "price" SET DATA TYPE TEXT,
ALTER COLUMN "price_per_annum" SET DATA TYPE TEXT,
ALTER COLUMN "price_per_month" SET DATA TYPE TEXT,
ALTER COLUMN "display_img" SET DATA TYPE TEXT,
ALTER COLUMN "views" SET DEFAULT 0,
ALTER COLUMN "views" SET DATA TYPE INTEGER,
ALTER COLUMN "images" SET DATA TYPE TEXT[];
