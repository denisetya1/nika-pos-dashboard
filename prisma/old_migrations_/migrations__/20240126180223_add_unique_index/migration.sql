/*
  Warnings:

  - A unique constraint covering the columns `[storeId,outlet_id,payment_type_id]` on the table `outlet_payment_types` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `outlet_payment_types_storeId_outlet_id_payment_type_id_key` ON `outlet_payment_types`(`storeId`, `outlet_id`, `payment_type_id`);
