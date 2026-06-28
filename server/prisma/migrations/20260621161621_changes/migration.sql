-- DropForeignKey
ALTER TABLE "QuizAvailablePeriodModel" DROP CONSTRAINT "QuizAvailablePeriodModel_quizId_fkey";

-- DropForeignKey
ALTER TABLE "QuizQuestionModel" DROP CONSTRAINT "QuizQuestionModel_quizId_fkey";

-- AlterTable
ALTER TABLE "QuizModel" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'private';

-- AddForeignKey
ALTER TABLE "QuizQuestionModel" ADD CONSTRAINT "QuizQuestionModel_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "QuizModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAvailablePeriodModel" ADD CONSTRAINT "QuizAvailablePeriodModel_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "QuizModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
