/*
  Warnings:

  - You are about to drop the `outlet_payment_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sales` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sales_products` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `outlet_payment_types` DROP FOREIGN KEY `outlet_payment_types_payment_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `sales` DROP FOREIGN KEY `sales_outlet_id_fkey`;

-- DropForeignKey
ALTER TABLE `sales` DROP FOREIGN KEY `sales_payment_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `sales` DROP FOREIGN KEY `sales_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `sales_products` DROP FOREIGN KEY `sales_products_sales_id_fkey`;

-- AlterTable
ALTER TABLE `brands` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `categories` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `cities` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `districts` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `move_types` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `outlets` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `product_stocks` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `products` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `provinces` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `roles` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `stock_movements` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `stock_request_products` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `stock_requests` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `stores` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `subdistricts` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `suppliers` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user_roles` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `updated_at` DATETIME(3) NULL;

-- DropTable
DROP TABLE `outlet_payment_types`;

-- DropTable
DROP TABLE `payment_types`;

-- DropTable
DROP TABLE `sales`;

-- DropTable
DROP TABLE `sales_products`;

-- CreateTable
CREATE TABLE `payment_methods` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `display_name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `img` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `outlet_payment_methods` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `outlet_id` BIGINT NULL,
    `storeId` BIGINT NULL,
    `payment_method_id` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `outlet_payment_methods_storeId_outlet_id_payment_method_id_key`(`storeId`, `outlet_id`, `payment_method_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shifts` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `outlet_id` BIGINT NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `sort` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShiftDetail` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `shift_id` BIGINT NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `start_date_time` DATETIME(3) NOT NULL,
    `end_date_time` DATETIME(3) NULL,
    `capital` DECIMAL(10, 2) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transantions` (
    `id` VARCHAR(25) NOT NULL,
    `outlet_id` BIGINT NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `shift_id` BIGINT NOT NULL,
    `total_item` INTEGER NULL,
    `total_price` DECIMAL(10, 2) NULL,
    `total_discount` DECIMAL(10, 2) NULL,
    `amount_paid` DECIMAL(10, 2) NULL,
    `amount_change` DECIMAL(10, 2) NULL,
    `outlet_payment_method_id` BIGINT NULL,
    `card_number` VARCHAR(191) NULL,
    `confirm_number` VARCHAR(191) NULL,
    `transaction_time` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transantions_products` (
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

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `outlet_payment_methods` ADD CONSTRAINT `outlet_payment_methods_payment_method_id_fkey` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shifts` ADD CONSTRAINT `shifts_outlet_id_fkey` FOREIGN KEY (`outlet_id`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShiftDetail` ADD CONSTRAINT `ShiftDetail_shift_id_fkey` FOREIGN KEY (`shift_id`) REFERENCES `shifts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShiftDetail` ADD CONSTRAINT `ShiftDetail_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transantions` ADD CONSTRAINT `transantions_outlet_id_fkey` FOREIGN KEY (`outlet_id`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transantions` ADD CONSTRAINT `transantions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transantions` ADD CONSTRAINT `transantions_shift_id_fkey` FOREIGN KEY (`shift_id`) REFERENCES `shifts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transantions` ADD CONSTRAINT `transantions_outlet_payment_method_id_fkey` FOREIGN KEY (`outlet_payment_method_id`) REFERENCES `outlet_payment_methods`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transantions_products` ADD CONSTRAINT `transantions_products_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `transantions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
