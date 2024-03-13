-- AlterTable
ALTER TABLE `TestTransaction` MODIFY `data` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `roles` MODIFY `roles` JSON NULL;

-- CreateTable
CREATE TABLE `request_edit_transactions` (
    `id` VARCHAR(191) NOT NULL,
    `transaction_id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,
    `updated_by` VARCHAR(191) NULL DEFAULT '',

    UNIQUE INDEX `request_edit_transactions_transaction_id_code_key`(`transaction_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
