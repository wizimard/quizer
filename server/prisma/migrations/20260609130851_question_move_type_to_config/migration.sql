/*
  Warnings:

  - You are about to drop the column `type` on the `QuizQuestionModel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuizModel" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "QuizQuestionModel" DROP COLUMN "type";
