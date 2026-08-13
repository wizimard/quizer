/*
  Warnings:

  - Added the required column `value` to the `TestSessionAnswerModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestSessionAnswerModel" ADD COLUMN     "value" TEXT NOT NULL;
