/*
  Warnings:

  - You are about to drop the column `paymentTypeId` on the `outlet_payment_types` table. All the data in the column will be lost.
  - You are about to drop the column `outletId` on the `product_stocks` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `product_stocks` table. All the data in the column will be lost.
  - You are about to drop the column `consfirm_number` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `outletId` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `sales` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[store_id,product_id,outlet_id]` on the table `product_stocks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `payment_type_id` to the `outlet_payment_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outlet_id` to the `product_stocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `store_id` to the `product_stocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outlet_id` to the `sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `outlet_payment_types` DROP FOREIGN KEY `outlet_payment_types_paymentTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `product_stocks` DROP FOREIGN KEY `product_stocks_outletId_fkey`;

-- DropForeignKey
ALTER TABLE `product_stocks` DROP FOREIGN KEY `product_stocks_storeId_fkey`;

-- DropForeignKey
ALTER TABLE `sales` DROP FOREIGN KEY `sales_outletId_fkey`;

-- DropForeignKey
ALTER TABLE `sales` DROP FOREIGN KEY `sales_paymentTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `sales` DROP FOREIGN KEY `sales_userId_fkey`;

-- DropIndex
DROP INDEX `product_stocks_storeId_product_id_outletId_key` ON `product_stocks`;

-- AlterTable
ALTER TABLE `outlet_payment_types` RENAME COLUMN `paymentTypeId` to `payment_type_id`;

-- AlterTable
ALTER TABLE `product_stocks` RENAME COLUMN `outletId` to `outlet_id`,
    RENAME COLUMN `storeId` to `store_id`;

-- AlterTable
ALTER TABLE `sales` RENAME COLUMN `consfirm_number` to `confirm_number`,
    RENAME COLUMN `outletId` to `outlet_id`,
    RENAME COLUMN `userId` to `user_id`,
    MODIFY `total_quantity` INTEGER NULL,
    MODIFY `total_price` DECIMAL(10, 2) NULL,
    MODIFY `total_discount` DECIMAL(10, 2) NULL,
    MODIFY `total_final_price` DECIMAL(10, 2) NULL,
    MODIFY `payment_amount` DECIMAL(10, 2) NULL,
    MODIFY `change_amount` DECIMAL(10, 2) NULL,
    MODIFY `paymentTypeId` INTEGER NULL,
    MODIFY `card_number` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `stock_movements` ADD COLUMN `move_date_str` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX `product_stocks_store_id_product_id_outlet_id_key` ON `product_stocks`(`store_id`, `product_id`, `outlet_id`);

-- AddForeignKey
ALTER TABLE `product_stocks` ADD CONSTRAINT `product_stocks_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_stocks` ADD CONSTRAINT `product_stocks_outlet_id_fkey` FOREIGN KEY (`outlet_id`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outlet_payment_types` ADD CONSTRAINT `outlet_payment_types_payment_type_id_fkey` FOREIGN KEY (`payment_type_id`) REFERENCES `payment_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_outlet_id_fkey` FOREIGN KEY (`outlet_id`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_paymentTypeId_fkey` FOREIGN KEY (`paymentTypeId`) REFERENCES `payment_types`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
