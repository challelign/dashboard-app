/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `invoice` MODIFY `customer_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Invoice_id_key` ON `Invoice`(`id`);

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
