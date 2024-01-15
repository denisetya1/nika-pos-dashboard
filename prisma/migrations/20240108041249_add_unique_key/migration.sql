/*
  Warnings:

  - A unique constraint covering the columns `[storeId,product_id,outletId]` on the table `product_stocks` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `stock_movements` MODIFY `description` TEXT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `product_stocks_storeId_product_id_outletId_key` ON `product_stocks`(`storeId`, `product_id`, `outletId`);
