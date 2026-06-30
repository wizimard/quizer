/*
  Warnings:

  - Added the required column `quizSettingsId` to the `QuizAvailablePeriodModel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QuizAvailablePeriodModel" DROP CONSTRAINT "QuizAvailablePeriodModel_quizId_fkey";

-- AlterTable
ALTER TABLE "QuizAvailablePeriodModel" ADD COLUMN     "quizSettingsId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "QuizSettingsModel" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizSettingsModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuizSettingsModel_quizId_key" ON "QuizSettingsModel"("quizId");

-- AddForeignKey
ALTER TABLE "QuizSettingsModel" ADD CONSTRAINT "QuizSettingsModel_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "QuizModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAvailablePeriodModel" ADD CONSTRAINT "QuizAvailablePeriodModel_quizSettingsId_fkey" FOREIGN KEY ("quizSettingsId") REFERENCES "QuizSettingsModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
