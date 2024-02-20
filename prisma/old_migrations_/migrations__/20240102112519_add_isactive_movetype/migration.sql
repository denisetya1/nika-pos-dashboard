-- DropIndex
DROP INDEX `move_types_store_id_fkey` ON `move_types`;

-- AlterTable
ALTER TABLE `move_types` ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true;
