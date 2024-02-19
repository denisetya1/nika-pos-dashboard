/*
  Warnings:

  - You are about to drop the column `store_id` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `sub_account_of` on the `users` table. All the data in the column will be lost.
  - Added the required column `outlet_id` to the `devices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `devices` DROP COLUMN `store_id`,
    ADD COLUMN `outlet_id` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `sub_account_of`,
    ADD COLUMN `store_id` BIGINT NULL;
