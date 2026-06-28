-- AlterTable
ALTER TABLE "QuizSettingsModel" ADD COLUMN     "executeCredentials" JSONB,
ADD COLUMN     "isShowAnswersAfterCompletion" BOOLEAN NOT NULL DEFAULT false;
