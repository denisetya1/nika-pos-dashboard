-- AlterTable
ALTER TABLE `outlets` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `printExtraInfo` VARCHAR(191) NULL,
    ADD COLUMN `printHeaderLine1` VARCHAR(191) NULL,
    ADD COLUMN `printHeaderLine2` VARCHAR(191) NULL;
