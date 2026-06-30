-- CreateEnum
CREATE TYPE "QuizSessionStatus" AS ENUM ('active', 'finished', 'expired');

-- AlterTable
ALTER TABLE "QuizSettingsModel" ALTER COLUMN "isRequiredFirstName" SET DEFAULT true,
ALTER COLUMN "isRequiredLastName" SET DEFAULT true;

-- CreateTable
CREATE TABLE "QuizSessionModel" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "status" "QuizSessionStatus" NOT NULL DEFAULT 'active',

    CONSTRAINT "QuizSessionModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuizSessionModel_quizId_status_idx" ON "QuizSessionModel"("quizId", "status");

-- AddForeignKey
ALTER TABLE "QuizSessionModel" ADD CONSTRAINT "QuizSessionModel_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "QuizModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
