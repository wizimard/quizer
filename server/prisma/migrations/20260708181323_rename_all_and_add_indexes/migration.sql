/*
  Warnings:

  - You are about to drop the column `createdAt` on the `UserModel` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserModel` table. All the data in the column will be lost.
  - You are about to drop the `QuizAvailablePeriodModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizQuestionModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizSessionModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizSettingsModel` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `UserModel` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TestSessionStatus" AS ENUM ('active', 'finished', 'expired');

-- CreateEnum
CREATE TYPE "TestSessionStartBy" AS ENUM ('manually', 'scheduled');

-- DropForeignKey
ALTER TABLE "QuizAvailablePeriodModel" DROP CONSTRAINT "QuizAvailablePeriodModel_quizSettingsId_fkey";

-- DropForeignKey
ALTER TABLE "QuizModel" DROP CONSTRAINT "QuizModel_authorId_fkey";

-- DropForeignKey
ALTER TABLE "QuizQuestionModel" DROP CONSTRAINT "QuizQuestionModel_quizId_fkey";

-- DropForeignKey
ALTER TABLE "QuizSessionModel" DROP CONSTRAINT "QuizSessionModel_quizId_fkey";

-- DropForeignKey
ALTER TABLE "QuizSettingsModel" DROP CONSTRAINT "QuizSettingsModel_quizId_fkey";

-- AlterTable
ALTER TABLE "UserModel" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "QuizAvailablePeriodModel";

-- DropTable
DROP TABLE "QuizModel";

-- DropTable
DROP TABLE "QuizQuestionModel";

-- DropTable
DROP TABLE "QuizSessionModel";

-- DropTable
DROP TABLE "QuizSettingsModel";

-- DropEnum
DROP TYPE "QuizAvailablePeriodStatus";

-- DropEnum
DROP TYPE "QuizSessionStatus";

-- CreateTable
CREATE TABLE "TestModel" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "author_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestSettingsModel" (
    "id" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,
    "show_answers_after_completion" BOOLEAN NOT NULL DEFAULT false,
    "required_email" BOOLEAN NOT NULL DEFAULT false,
    "required_first_name" BOOLEAN NOT NULL DEFAULT true,
    "required_last_name" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestSettingsModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestQuestionModel" (
    "id" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sort_key" INTEGER NOT NULL,
    "config" JSONB,

    CONSTRAINT "TestQuestionModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestSchedulerPeriodModel" (
    "id" BIGSERIAL NOT NULL,
    "test_id" TEXT NOT NULL,
    "available_from" TIMESTAMP(3) NOT NULL,
    "available_to" TIMESTAMP(3),

    CONSTRAINT "TestSchedulerPeriodModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestSessionModel" (
    "id" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    "status" "TestSessionStatus" NOT NULL DEFAULT 'active',
    "start_by" "TestSessionStartBy" NOT NULL DEFAULT 'manually',

    CONSTRAINT "TestSessionModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TestModel_author_id_idx" ON "TestModel"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "TestSettingsModel_test_id_key" ON "TestSettingsModel"("test_id");

-- CreateIndex
CREATE INDEX "TestQuestionModel_test_id_idx" ON "TestQuestionModel"("test_id");

-- CreateIndex
CREATE UNIQUE INDEX "TestQuestionModel_test_id_sort_key_key" ON "TestQuestionModel"("test_id", "sort_key");

-- CreateIndex
CREATE INDEX "TestSchedulerPeriodModel_test_id_idx" ON "TestSchedulerPeriodModel"("test_id");

-- CreateIndex
CREATE INDEX "TestSchedulerPeriodModel_available_from_idx" ON "TestSchedulerPeriodModel"("available_from");

-- CreateIndex
CREATE INDEX "TestSessionModel_test_id_idx" ON "TestSessionModel"("test_id");

-- CreateIndex
CREATE UNIQUE INDEX "TestSessionModel_test_id_status_key" ON "TestSessionModel"("test_id", "status");

-- AddForeignKey
ALTER TABLE "TestModel" ADD CONSTRAINT "TestModel_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSettingsModel" ADD CONSTRAINT "TestSettingsModel_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "TestModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestQuestionModel" ADD CONSTRAINT "TestQuestionModel_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "TestModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSchedulerPeriodModel" ADD CONSTRAINT "TestSchedulerPeriodModel_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "TestModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSessionModel" ADD CONSTRAINT "TestSessionModel_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "TestModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
