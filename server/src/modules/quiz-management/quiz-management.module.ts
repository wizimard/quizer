import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { QM_TYPES } from './quiz-management.types';
import type { QuizRepository } from './interfaces/repository/quiz.repository.interface';
import type { QuizExecutionRepository } from './interfaces/repository/quiz-execution.repository.interface';
import type { QuestionRepository } from './interfaces/repository/question.repository.interface';
import { PrismaQuizRepository } from './repositories/prisma-quiz.repository';
import { PrismaQuizExecutionRepository } from './repositories/prisma-quiz-execution.repository';
import { PrismaQuestionRepository } from './repositories/prisma-question.repository';
import { QuizService } from './services/quiz.service';
import { QuestionService } from './services/question.service';
import { QuizController } from './controllers/quiz.controller';
import { QuestionController } from './controllers/question.controller';
import { QuizMiddleware } from './middlewares/quiz.middleware';
import { QuizOwnershipGuard } from './middlewares/quiz-ownership.guard';

const quizManagementModule: ContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind<QuizRepository>(QM_TYPES.QUIZ_REPOSITORY).to(PrismaQuizRepository).inSingletonScope();
	options.bind<QuizExecutionRepository>(QM_TYPES.QUIZ_EXECUTION_REPOSITORY).to(PrismaQuizExecutionRepository).inSingletonScope();
	options.bind<QuestionRepository>(QM_TYPES.QUESTION_REPOSITORY).to(PrismaQuestionRepository).inSingletonScope();
	options.bind(QM_TYPES.QUIZ_SERVICE).to(QuizService).inSingletonScope();
	options.bind(QM_TYPES.QUESTION_SERVICE).to(QuestionService).inSingletonScope();
	options.bind(QM_TYPES.QUIZ_CONTROLLER).to(QuizController).inSingletonScope();
	options.bind(QM_TYPES.QUESTION_CONTROLLER).to(QuestionController).inSingletonScope();
	options.bind(QM_TYPES.QUIZ_MIDDLEWARE).to(QuizMiddleware).inSingletonScope();
	options.bind(QM_TYPES.QUIZ_OWNERSHIP_GUARD).to(QuizOwnershipGuard).inSingletonScope();
});

export { quizManagementModule, QM_TYPES };
