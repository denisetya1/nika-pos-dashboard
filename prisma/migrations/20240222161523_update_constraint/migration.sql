/*
  Warnings:

  - Made the column `outlet_payment_method_id` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_outlet_payment_method_id_fkey`;

-- AlterTable
ALTER TABLE `transactions` MODIFY `outlet_payment_method_id` BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_outlet_payment_method_id_fkey` FOREIGN KEY (`outlet_payment_method_id`) REFERENCES `outlet_payment_methods`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
