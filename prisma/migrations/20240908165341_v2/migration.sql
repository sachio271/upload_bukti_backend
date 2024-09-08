-- AlterTable
ALTER TABLE `uploads` ADD COLUMN `is_accept` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'user';
