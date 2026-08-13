-- CreateTable
CREATE TABLE "TestSessionRegisteredUserModel" (
    "id" TEXT NOT NULL,
    "test_session_id" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestSessionRegisteredUserModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestSessionAnswerModel" (
    "id" TEXT NOT NULL,
    "test_session_registered_user_id" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestSessionAnswerModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TestSessionRegisteredUserModel_test_session_id_idx" ON "TestSessionRegisteredUserModel"("test_session_id");

-- CreateIndex
CREATE INDEX "TestSessionRegisteredUserModel_test_id_idx" ON "TestSessionRegisteredUserModel"("test_id");

-- CreateIndex
CREATE INDEX "TestSessionAnswerModel_test_session_registered_user_id_idx" ON "TestSessionAnswerModel"("test_session_registered_user_id");

-- CreateIndex
CREATE INDEX "TestSessionAnswerModel_test_id_idx" ON "TestSessionAnswerModel"("test_id");

-- AddForeignKey
ALTER TABLE "TestSessionRegisteredUserModel" ADD CONSTRAINT "TestSessionRegisteredUserModel_test_session_id_fkey" FOREIGN KEY ("test_session_id") REFERENCES "TestSessionModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSessionRegisteredUserModel" ADD CONSTRAINT "TestSessionRegisteredUserModel_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "TestModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSessionAnswerModel" ADD CONSTRAINT "TestSessionAnswerModel_test_session_registered_user_id_fkey" FOREIGN KEY ("test_session_registered_user_id") REFERENCES "TestSessionRegisteredUserModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSessionAnswerModel" ADD CONSTRAINT "TestSessionAnswerModel_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "TestModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
