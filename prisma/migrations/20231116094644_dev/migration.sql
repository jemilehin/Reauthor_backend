/*
  Warnings:

  - The `images` column on the `Property` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Auctioned_Property" ADD COLUMN     "participants" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "images",
ADD COLUMN     "images" BYTEA[] DEFAULT ARRAY[]::BYTEA[];
