-- DropIndex
DROP INDEX `transactions_outlet_id_fkey` ON `transactions`;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_outlet_id_fkey` FOREIGN KEY (`outlet_id`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
