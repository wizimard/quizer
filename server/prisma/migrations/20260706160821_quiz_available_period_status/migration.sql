-- CreateEnum
CREATE TYPE "QuizAvailablePeriodModelStatus" AS ENUM ('open', 'closed', 'expired', 'scheduled');

-- AlterTable
ALTER TABLE "QuizAvailablePeriodModel" ADD COLUMN     "status" "QuizAvailablePeriodModelStatus" NOT NULL DEFAULT 'scheduled';
