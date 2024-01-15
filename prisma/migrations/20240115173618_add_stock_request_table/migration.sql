-- AlterTable
ALTER TABLE `stock_movements` ADD COLUMN `end_quantity` INTEGER NULL,
    ADD COLUMN `start_quantity` INTEGER NULL;

-- CreateTable
CREATE TABLE `StockRequest` (
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
CREATE TABLE `StockRequestProduct` (
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

-- AddForeignKey
ALTER TABLE `StockRequest` ADD CONSTRAINT `StockRequest_request_outled_id_fkey` FOREIGN KEY (`request_outled_id`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockRequest` ADD CONSTRAINT `StockRequest_destination_outled_id_fkey` FOREIGN KEY (`destination_outled_id`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockRequestProduct` ADD CONSTRAINT `StockRequestProduct_stockRequestId_fkey` FOREIGN KEY (`stockRequestId`) REFERENCES `StockRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockRequestProduct` ADD CONSTRAINT `StockRequestProduct_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
