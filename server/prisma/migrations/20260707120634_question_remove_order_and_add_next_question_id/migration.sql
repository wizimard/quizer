/*
  Warnings:

  - You are about to drop the column `order` on the `QuizQuestionModel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuizQuestionModel" DROP COLUMN "order",
ADD COLUMN     "nextQuestionId" TEXT;
