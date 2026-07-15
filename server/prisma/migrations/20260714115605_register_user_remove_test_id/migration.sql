/*
  Warnings:

  - You are about to drop the column `test_id` on the `TestSessionAnswerModel` table. All the data in the column will be lost.
  - You are about to drop the column `test_id` on the `TestSessionRegisteredUserModel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[questionId,test_session_registered_user_id]` on the table `TestSessionAnswerModel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `questionId` to the `TestSessionAnswerModel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TestSessionAnswerModel" DROP CONSTRAINT "TestSessionAnswerModel_test_id_fkey";

-- DropForeignKey
ALTER TABLE "TestSessionRegisteredUserModel" DROP CONSTRAINT "TestSessionRegisteredUserModel_test_id_fkey";

-- DropIndex
DROP INDEX "TestSessionAnswerModel_test_id_idx";

-- DropIndex
DROP INDEX "TestSessionRegisteredUserModel_test_id_idx";

-- AlterTable
ALTER TABLE "TestSessionAnswerModel" DROP COLUMN "test_id",
ADD COLUMN     "questionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TestSessionRegisteredUserModel" DROP COLUMN "test_id";

-- CreateIndex
CREATE INDEX "TestSessionAnswerModel_questionId_idx" ON "TestSessionAnswerModel"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "TestSessionAnswerModel_questionId_test_session_registered_u_key" ON "TestSessionAnswerModel"("questionId", "test_session_registered_user_id");

-- AddForeignKey
ALTER TABLE "TestSessionAnswerModel" ADD CONSTRAINT "TestSessionAnswerModel_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "TestQuestionModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
