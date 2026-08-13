/*
  Warnings:

  - You are about to drop the column `email` on the `TestSessionRegisteredUserModel` table. All the data in the column will be lost.
  - Made the column `first_name` on table `TestSessionRegisteredUserModel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_name` on table `TestSessionRegisteredUserModel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TestSessionAnswerModel" ADD COLUMN     "skipped" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "TestSessionRegisteredUserModel" DROP COLUMN "email",
ALTER COLUMN "first_name" SET NOT NULL,
ALTER COLUMN "last_name" SET NOT NULL;
