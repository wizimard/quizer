import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { QM_TYPES } from './quiz-management.types';
import type { QuizRepository } from './domain/repositories/quiz.repository.port';
import { PrismaQuizRepository } from './infrastructure/persistence/repositories/prisma-quiz.repository';
import { CreateQuizHandler } from './application/handlers/create-quiz.handler';
import { UpdateQuizHandler } from './application/handlers/update-quiz.handler';
import { UpdateQuizSettingsHandler } from './application/handlers/update-quiz-settings.handler';
import { DeleteQuizHandler } from './application/handlers/delete-quiz.handler';
import { GetQuizByIdHandler } from './application/handlers/get-quiz-by-id.handler';
import { GetQuizzesByAuthorHandler } from './application/handlers/get-quizzes-by-author.handler';
import { QuizController } from './interfaces/http/controllers/quiz.controller';

const quizManagementModule: ContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind<QuizRepository>(QM_TYPES.QUIZ_REPOSITORY).to(PrismaQuizRepository).inSingletonScope();
	options.bind(QM_TYPES.CREATE_QUIZ_HANDLER).to(CreateQuizHandler).inSingletonScope();
	options.bind(QM_TYPES.UPDATE_QUIZ_HANDLER).to(UpdateQuizHandler).inSingletonScope();
	options.bind(QM_TYPES.UPDATE_QUIZ_SETTINGS_HANDLER).to(UpdateQuizSettingsHandler).inSingletonScope();
	options.bind(QM_TYPES.DELETE_QUIZ_HANDLER).to(DeleteQuizHandler).inSingletonScope();
	options.bind(QM_TYPES.GET_QUIZ_BY_ID_HANDLER).to(GetQuizByIdHandler).inSingletonScope();
	options.bind(QM_TYPES.GET_QUIZZES_BY_AUTHOR_HANDLER).to(GetQuizzesByAuthorHandler).inSingletonScope();
	options.bind(QM_TYPES.QUIZ_CONTROLLER).to(QuizController).inSingletonScope();
});

export { quizManagementModule, QM_TYPES };
