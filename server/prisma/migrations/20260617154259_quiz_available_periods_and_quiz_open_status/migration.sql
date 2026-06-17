-- AlterTable
ALTER TABLE "QuizModel" ADD COLUMN     "isOpen" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "QuizAvailablePeriodModel" (
    "id" BIGSERIAL NOT NULL,
    "quizId" TEXT NOT NULL,
    "available_from" TIMESTAMP(3) NOT NULL,
    "available_to" TIMESTAMP(3),

    CONSTRAINT "QuizAvailablePeriodModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuizAvailablePeriodModel" ADD CONSTRAINT "QuizAvailablePeriodModel_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "QuizModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
