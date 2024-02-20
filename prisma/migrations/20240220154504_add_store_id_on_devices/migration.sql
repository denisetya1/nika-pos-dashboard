/*
  Warnings:

  - Added the required column `store_id` to the `devices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `devices` ADD COLUMN `store_id` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `is_sub_account` BOOLEAN NULL;
