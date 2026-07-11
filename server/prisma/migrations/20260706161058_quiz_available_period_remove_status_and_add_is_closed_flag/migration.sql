/*
  Warnings:

  - You are about to drop the column `status` on the `QuizAvailablePeriodModel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuizAvailablePeriodModel" DROP COLUMN "status",
ADD COLUMN     "isClosed" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "QuizAvailablePeriodModelStatus";
