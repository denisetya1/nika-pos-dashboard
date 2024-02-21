/*
  Warnings:

  - You are about to drop the column `printHeaderLine1` on the `outlets` table. All the data in the column will be lost.
  - You are about to drop the column `printHeaderLine2` on the `outlets` table. All the data in the column will be lost.
  - You are about to drop the column `printHeaderLine3` on the `outlets` table. All the data in the column will be lost.
  - You are about to drop the column `printHeaderLine4` on the `outlets` table. All the data in the column will be lost.
  - You are about to drop the column `printHeaderLogo` on the `outlets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `outlets` DROP COLUMN `printHeaderLine1`,
    DROP COLUMN `printHeaderLine2`,
    DROP COLUMN `printHeaderLine3`,
    DROP COLUMN `printHeaderLine4`,
    DROP COLUMN `printHeaderLogo`,
    ADD COLUMN `print_header_line1` VARCHAR(191) NULL,
    ADD COLUMN `print_header_line2` VARCHAR(191) NULL,
    ADD COLUMN `print_header_line3` VARCHAR(191) NULL,
    ADD COLUMN `print_header_line4` VARCHAR(191) NULL,
    ADD COLUMN `print_header_logo` VARCHAR(191) NULL;
