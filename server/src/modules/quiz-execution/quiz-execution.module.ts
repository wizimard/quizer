import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { QE_TYPES } from './quiz-execution.types';
import type { QuestionReadRepository } from './repositories/question-read.repository.interface';
import { PrismaQuestionReadRepository } from './repositories/prisma-question-read.repository';
import { QuizExecutionService } from './services/quiz-execution.service';
import { QuizSessionService } from './services/quiz-session.service';
import { QuizExecuteController } from './controllers/quiz-execute.controller';

const quizExecutionModule: ContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind<QuestionReadRepository>(QE_TYPES.QUESTION_READ_REPOSITORY).to(PrismaQuestionReadRepository).inSingletonScope();
	options.bind(QE_TYPES.QUIZ_EXECUTION_SERVICE).to(QuizExecutionService).inSingletonScope();
	options.bind(QE_TYPES.QUIZ_SESSION_SERVICE).to(QuizSessionService).inSingletonScope();
	options.bind(QE_TYPES.QUIZ_EXECUTE_CONTROLLER).to(QuizExecuteController).inSingletonScope();
});

export { quizExecutionModule, QE_TYPES };
