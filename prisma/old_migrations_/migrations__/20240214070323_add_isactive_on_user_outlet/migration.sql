/*
  Warnings:

  - Added the required column `is_active` to the `user_outlets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_outlets` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `is_active` BOOLEAN NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `phone` VARCHAR(191) NULL;
