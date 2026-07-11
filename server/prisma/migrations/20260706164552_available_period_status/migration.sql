/*
  Warnings:

  - You are about to drop the column `isClosed` on the `QuizAvailablePeriodModel` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "QuizAvailablePeriodStatus" AS ENUM ('open', 'manually_closed', 'scheduled', 'expired');

-- AlterTable
ALTER TABLE "QuizAvailablePeriodModel" DROP COLUMN "isClosed",
ADD COLUMN     "status" "QuizAvailablePeriodStatus" NOT NULL DEFAULT 'scheduled';
