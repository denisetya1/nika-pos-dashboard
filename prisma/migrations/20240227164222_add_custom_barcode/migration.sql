-- CreateTable
CREATE TABLE `custom_barcodes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `barcode` VARCHAR(191) NOT NULL,
    `product_id` BIGINT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,
    `updated_by` VARCHAR(191) NULL DEFAULT '',

    UNIQUE INDEX `custom_barcodes_product_id_key`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `custom_barcodes` ADD CONSTRAINT `custom_barcodes_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
