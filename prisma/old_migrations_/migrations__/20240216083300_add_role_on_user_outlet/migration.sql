/*
  Warnings:

  - Added the required column `role_id` to the `user_outlets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_outlets` ADD COLUMN `role_id` BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE `user_outlets` ADD CONSTRAINT `user_outlets_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
