/*
  Warnings:

  - You are about to drop the column `deviceName` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `deviceType` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `osName` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `osVersion` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `platformApiLevel` on the `devices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `devices` DROP COLUMN `deviceName`,
    DROP COLUMN `deviceType`,
    DROP COLUMN `osName`,
    DROP COLUMN `osVersion`,
    DROP COLUMN `platformApiLevel`,
    ADD COLUMN `device_name` VARCHAR(191) NULL,
    ADD COLUMN `device_type` INTEGER NULL,
    ADD COLUMN `os_name` VARCHAR(191) NULL,
    ADD COLUMN `os_version` VARCHAR(191) NULL,
    ADD COLUMN `platform_api_level` INTEGER NULL;
