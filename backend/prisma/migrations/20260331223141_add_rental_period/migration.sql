-- CreateEnum
CREATE TYPE "RentalPeriod" AS ENUM ('DAY', 'WEEK', 'MONTH');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "rentalPeriod" "RentalPeriod" NOT NULL DEFAULT 'DAY';
