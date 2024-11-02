/*
  Warnings:

  - Added the required column `renterId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` ADD COLUMN `renterId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_renterId_fkey` FOREIGN KEY (`renterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
