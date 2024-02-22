/*
  Warnings:

  - Added the required column `product_stock_id` to the `transaction_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaction_details` ADD COLUMN `product_stock_id` BIGINT NOT NULL;
