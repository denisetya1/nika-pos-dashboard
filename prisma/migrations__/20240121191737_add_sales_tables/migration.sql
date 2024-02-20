/*
  Warnings:

  - You are about to drop the `StockRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StockRequestProduct` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `stores` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `StockRequest` DROP FOREIGN KEY `StockRequest_destination_outled_id_fkey`;

-- DropForeignKey
ALTER TABLE `StockRequest` DROP FOREIGN KEY `StockRequest_request_outled_id_fkey`;

-- DropForeignKey
ALTER TABLE `StockRequestProduct` DROP FOREIGN KEY `StockRequestProduct_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `StockRequestProduct` DROP FOREIGN KEY `StockRequestProduct_stockRequestId_fkey`;

-- AlterTable
ALTER TABLE `stores` ADD COLUMN `slug` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `is_sub_account` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `username` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `is_active` BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE `StockRequest`;

-- DropTable
DROP TABLE `StockRequestProduct`;

-- CreateTable
CREATE TABLE `stock_requests` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `request_time` DATETIME(3) NOT NULL,
    `approved_time` DATETIME(3) NULL,
    `request_outled_id` BIGINT NOT NULL,
    `destination_outled_id` BIGINT NOT NULL,
    `is_closed` BOOLEAN NOT NULL DEFAULT false,
    `is_approved` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_request_products` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `stockRequestId` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `quantity` INTEGER NOT NULL,
    `is_approved` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `display_name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `img` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `outlet_payment_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `outlet_id` BIGINT NULL,
    `storeId` BIGINT NULL,
    `is_active` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sales` (
    `id` VARCHAR(25) NOT NULL,
    `outletId` BIGINT NOT NULL,
    `userId` BIGINT NOT NULL,
    `total_quantity` INTEGER NOT NULL,
    `total_price` DECIMAL(10, 2) NOT NULL,
    `total_discount` DECIMAL(10, 2) NOT NULL,
    `total_final_price` DECIMAL(10, 2) NOT NULL,
    `payment_amount` DECIMAL(10, 2) NOT NULL,
    `change_amount` DECIMAL(10, 2) NOT NULL,
    `paymentTypeId` BIGINT NOT NULL,
    `card_number` VARCHAR(191) NOT NULL,
    `consfirm_number` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sales_products` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `sales_id` VARCHAR(191) NOT NULL,
    `product_id` BIGINT NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `barcode` VARCHAR(191) NULL,
    `quantity` INTEGER NOT NULL,
    `sellPrice` DECIMAL(10, 2) NOT NULL,
    `discount_percentage` INTEGER NULL,
    `markup_percentage` INTEGER NULL,
    `discountAmount` DECIMAL(10, 2) NOT NULL,
    `sellPriceGross` DECIMAL(10, 2) NOT NULL,
    `sellPriceFinal` DECIMAL(10, 2) NOT NULL,
    `totalSellPriceFinal` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `stores_slug_key` ON `stores`(`slug`);

-- CreateIndex
CREATE INDEX `users_email_password_idx` ON `users`(`email`, `password`);

-- CreateIndex
CREATE INDEX `users_username_password_idx` ON `users`(`username`, `password`);

-- AddForeignKey
ALTER TABLE `stock_requests` ADD CONSTRAINT `stock_requests_request_outled_id_fkey` FOREIGN KEY (`request_outled_id`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_requests` ADD CONSTRAINT `stock_requests_destination_outled_id_fkey` FOREIGN KEY (`destination_outled_id`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_request_products` ADD CONSTRAINT `stock_request_products_stockRequestId_fkey` FOREIGN KEY (`stockRequestId`) REFERENCES `stock_requests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_request_products` ADD CONSTRAINT `stock_request_products_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_outletId_fkey` FOREIGN KEY (`outletId`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_paymentTypeId_fkey` FOREIGN KEY (`paymentTypeId`) REFERENCES `payment_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales_products` ADD CONSTRAINT `sales_products_sales_id_fkey` FOREIGN KEY (`sales_id`) REFERENCES `sales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
