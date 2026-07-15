/*
  Warnings:

  - You are about to drop the column `required_email` on the `TestSettingsModel` table. All the data in the column will be lost.
  - You are about to drop the column `required_first_name` on the `TestSettingsModel` table. All the data in the column will be lost.
  - You are about to drop the column `required_last_name` on the `TestSettingsModel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TestSessionRegisteredUserModel" ADD COLUMN     "email" TEXT,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "last_name" TEXT;

-- AlterTable
ALTER TABLE "TestSettingsModel" DROP COLUMN "required_email",
DROP COLUMN "required_first_name",
DROP COLUMN "required_last_name";
