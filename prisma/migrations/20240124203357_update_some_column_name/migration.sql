/*
  Warnings:

  - You are about to drop the column `paymentTypeId` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `moveDate` on the `stock_movements` table. All the data in the column will be lost.
  - Added the required column `move_date` to the `stock_movements` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `sales` DROP FOREIGN KEY `sales_paymentTypeId_fkey`;

-- AlterTable
ALTER TABLE `sales` RENAME COLUMN `paymentTypeId` to `payment_type_id`;

-- AlterTable
ALTER TABLE `stock_movements` RENAME COLUMN `moveDate` to `move_date`;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_payment_type_id_fkey` FOREIGN KEY (`payment_type_id`) REFERENCES `payment_types`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
