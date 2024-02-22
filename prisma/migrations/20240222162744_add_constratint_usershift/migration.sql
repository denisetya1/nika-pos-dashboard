-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_user_shift_id_fkey` FOREIGN KEY (`user_shift_id`) REFERENCES `user_shifts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
