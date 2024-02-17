/*
  Warnings:

  - You are about to drop the column `updateBy` on the `brands` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `cities` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `daily_shifts` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `districts` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `move_types` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `outlet_payment_methods` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `outlets` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `payment_methods` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `product_stocks` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `provinces` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `shifts` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `stock_movements` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `stock_request_products` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `stock_requests` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `subdistricts` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `transaction_details` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `user_outlets` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `user_roles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `brands` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `categories` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `cities` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `daily_shifts` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `districts` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `move_types` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `outlet_payment_methods` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `outlets` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `payment_methods` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `product_stocks` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `products` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `provinces` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `roles` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `shifts` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `stock_movements` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `stock_request_products` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `stock_requests` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `stores` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `subdistricts` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `suppliers` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `transaction_details` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `transactions` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `user_outlets` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `user_roles` DROP COLUMN `updateBy`,
    ADD COLUMN `updated_by` VARCHAR(191) NULL DEFAULT '';
