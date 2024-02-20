/*
  Warnings:

  - You are about to drop the column `is_sub_account` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `transantion_details` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `stores` DROP FOREIGN KEY `stores_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `transantion_details` DROP FOREIGN KEY `transantion_details_transaction_id_fkey`;

-- AlterTable
ALTER TABLE `brands` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `categories` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `cities` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `daily_shifts` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `districts` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `move_types` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `outlet_payment_methods` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `outlets` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `payment_methods` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `product_stocks` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `products` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `provinces` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `roles` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `shifts` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `stock_movements` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `stock_request_products` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `stock_requests` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `stores` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `subdistricts` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `suppliers` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `user_outlets` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `user_roles` ADD COLUMN `updateBy` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `users` DROP COLUMN `is_sub_account`,
    ADD COLUMN `sub_account_of` BIGINT NULL,
    ADD COLUMN `update_by` VARCHAR(191) NULL DEFAULT '';

-- DropTable
DROP TABLE `transantion_details`;

-- CreateTable
CREATE TABLE `transaction_details` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `transaction_id` VARCHAR(191) NOT NULL,
    `product_id` BIGINT NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `barcode` VARCHAR(191) NULL,
    `category_id` BIGINT NOT NULL,
    `brand_id` BIGINT NOT NULL,
    `detail_category` ENUM('PRODUCT', 'DISCOUNT_VOUCHER', 'DISCOUNT_ADDITIONAL') NOT NULL DEFAULT 'PRODUCT',
    `qty` INTEGER NOT NULL,
    `sell_price` DECIMAL(10, 2) NOT NULL,
    `discount_percentage` INTEGER NULL,
    `markup_percentage` INTEGER NULL,
    `discount_amount` DECIMAL(10, 2) NOT NULL,
    `final_sell_price` DECIMAL(10, 2) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `total_discount` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,
    `updateBy` VARCHAR(191) NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transaction_details` ADD CONSTRAINT `transaction_details_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
