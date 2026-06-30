/*
  Warnings:

  - You are about to drop the column `executeCredentials` on the `QuizSettingsModel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuizSettingsModel" DROP COLUMN "executeCredentials",
ADD COLUMN     "isRequiredEmail" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRequiredFirstName" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRequiredLastName" BOOLEAN NOT NULL DEFAULT false;
