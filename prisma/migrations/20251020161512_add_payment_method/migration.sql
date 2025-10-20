/*
  Warnings:

  - You are about to drop the column `stripePaymentIntentId` on the `Order` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'CONFIRMED';

-- DropIndex
DROP INDEX "public"."Order_stripePaymentIntentId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "stripePaymentIntentId",
ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'COD';
