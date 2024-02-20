/*
  Warnings:

  - You are about to drop the `ShiftDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transantions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transantions_products` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ShiftDetail` DROP FOREIGN KEY `ShiftDetail_shift_id_fkey`;

-- DropForeignKey
ALTER TABLE `ShiftDetail` DROP FOREIGN KEY `ShiftDetail_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `transantions` DROP FOREIGN KEY `transantions_outlet_id_fkey`;

-- DropForeignKey
ALTER TABLE `transantions` DROP FOREIGN KEY `transantions_outlet_payment_method_id_fkey`;

-- DropForeignKey
ALTER TABLE `transantions` DROP FOREIGN KEY `transantions_shift_id_fkey`;

-- DropForeignKey
ALTER TABLE `transantions` DROP FOREIGN KEY `transantions_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `transantions_products` DROP FOREIGN KEY `transantions_products_transaction_id_fkey`;

-- DropTable
DROP TABLE `ShiftDetail`;

-- DropTable
DROP TABLE `VerificationToken`;

-- DropTable
DROP TABLE `transantions`;

-- DropTable
DROP TABLE `transantions_products`;

-- CreateTable
CREATE TABLE `verification_tokens` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `verification_tokens_token_key`(`token`),
    UNIQUE INDEX `verification_tokens_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_outlets` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `outlet_id` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daily_shifts` (
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
CREATE TABLE `transactions` (
    `id` VARCHAR(25) NOT NULL,
    `outlet_id` BIGINT NOT NULL,
    `store_id` BIGINT NOT NULL,
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
CREATE TABLE `transantion_details` (
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
ALTER TABLE `user_outlets` ADD CONSTRAINT `user_outlets_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_outlets` ADD CONSTRAINT `user_outlets_outlet_id_fkey` FOREIGN KEY (`outlet_id`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `daily_shifts` ADD CONSTRAINT `daily_shifts_shift_id_fkey` FOREIGN KEY (`shift_id`) REFERENCES `shifts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `daily_shifts` ADD CONSTRAINT `daily_shifts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_outlet_id_fkey` FOREIGN KEY (`outlet_id`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_shift_id_fkey` FOREIGN KEY (`shift_id`) REFERENCES `shifts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_outlet_payment_method_id_fkey` FOREIGN KEY (`outlet_payment_method_id`) REFERENCES `outlet_payment_methods`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transantion_details` ADD CONSTRAINT `transantion_details_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
