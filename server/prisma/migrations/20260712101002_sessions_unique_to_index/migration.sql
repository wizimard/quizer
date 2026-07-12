-- DropIndex
DROP INDEX "TestSessionModel_test_id_status_key";

-- CreateIndex
CREATE INDEX "TestSessionModel_test_id_status_idx" ON "TestSessionModel"("test_id", "status");
