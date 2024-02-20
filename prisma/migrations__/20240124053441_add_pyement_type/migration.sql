/*
  Warnings:

  - The primary key for the `payment_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `payment_types` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `paymentTypeId` on the `sales` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - Added the required column `paymentTypeId` to the `outlet_payment_types` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `sales` DROP FOREIGN KEY `sales_paymentTypeId_fkey`;

-- AlterTable
ALTER TABLE `outlet_payment_types` ADD COLUMN `paymentTypeId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `payment_types` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `sales` MODIFY `paymentTypeId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `outlet_payment_types` ADD CONSTRAINT `outlet_payment_types_paymentTypeId_fkey` FOREIGN KEY (`paymentTypeId`) REFERENCES `payment_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_paymentTypeId_fkey` FOREIGN KEY (`paymentTypeId`) REFERENCES `payment_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
