-- DropForeignKey
ALTER TABLE `move_types` DROP FOREIGN KEY `move_types_store_id_fkey`;

-- AlterTable
ALTER TABLE `move_types` MODIFY `store_id` BIGINT NULL;
