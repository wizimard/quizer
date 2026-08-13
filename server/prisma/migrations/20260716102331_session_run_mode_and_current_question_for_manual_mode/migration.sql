-- CreateEnum
CREATE TYPE "TestSessionRunMode" AS ENUM ('manual', 'free');

-- AlterTable
ALTER TABLE "TestSessionModel" ADD COLUMN     "current_question_id" TEXT,
ADD COLUMN     "run_mode" "TestSessionRunMode" NOT NULL DEFAULT 'free';

-- AddForeignKey
ALTER TABLE "TestSessionModel" ADD CONSTRAINT "TestSessionModel_current_question_id_fkey" FOREIGN KEY ("current_question_id") REFERENCES "TestQuestionModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
