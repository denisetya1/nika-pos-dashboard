/*
  Warnings:

  - You are about to drop the column `moveType` on the `stock_movements` table. All the data in the column will be lost.
  - You are about to drop the column `move_reason_id` on the `stock_movements` table. All the data in the column will be lost.
  - You are about to drop the `move_reasons` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `direction` to the `stock_movements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `move_type_id` to the `stock_movements` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `move_reasons` DROP FOREIGN KEY `move_reasons_store_id_fkey`;

-- DropForeignKey
ALTER TABLE `stock_movements` DROP FOREIGN KEY `stock_movements_move_reason_id_fkey`;

-- AlterTable
ALTER TABLE `stock_movements` DROP COLUMN `moveType`,
    DROP COLUMN `move_reason_id`,
    ADD COLUMN `direction` ENUM('IN', 'OUT') NOT NULL,
    ADD COLUMN `move_type_id` BIGINT NOT NULL;

-- DropTable
DROP TABLE `move_reasons`;

-- CreateTable
CREATE TABLE `move_types` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `direction` ENUM('IN', 'OUT') NOT NULL,
    `store_id` BIGINT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `move_types` ADD CONSTRAINT `move_types_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_movements` ADD CONSTRAINT `stock_movements_move_type_id_fkey` FOREIGN KEY (`move_type_id`) REFERENCES `move_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
