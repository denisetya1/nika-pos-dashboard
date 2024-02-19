/*
  Warnings:

  - You are about to drop the column `shift_id` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `user_shift_id` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
-- ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_shift_id_fkey`;

-- AlterTable
-- ALTER TABLE `transactions` DROP COLUMN `shift_id`,
  -- ADD COLUMN `user_shift_id` BIGINT NOT NULL;
