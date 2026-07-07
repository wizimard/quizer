/*
  Warnings:

  - You are about to drop the column `nextQuestionId` on the `QuizQuestionModel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[quizId,sort_key]` on the table `QuizQuestionModel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sort_key` to the `QuizQuestionModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuizQuestionModel" DROP COLUMN "nextQuestionId",
ADD COLUMN     "sort_key" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "QuizQuestionModel_quizId_sort_key_key" ON "QuizQuestionModel"("quizId", "sort_key");
