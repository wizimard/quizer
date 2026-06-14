-- CreateTable
CREATE TABLE "QuizModel" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuestionModel" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "config" JSONB NOT NULL,

    CONSTRAINT "QuizQuestionModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuizModel" ADD CONSTRAINT "QuizModel_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestionModel" ADD CONSTRAINT "QuizQuestionModel_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "QuizModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
