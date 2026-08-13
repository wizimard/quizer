import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { QM_TYPES } from './question-management.types';
import type { QuestionRepository } from './interfaces/repository/question.repository.interface';
import { PrismaQuestionRepository } from './repositories/prisma-question.repository';
import { DefaultQuestionService } from './services/question.service';
import { QuestionController } from './controllers/question.controller';

const questionManagementModule: ContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind<QuestionRepository>(QM_TYPES.QUESTION_REPOSITORY).to(PrismaQuestionRepository).inSingletonScope();
	options.bind(QM_TYPES.QUESTION_SERVICE).to(DefaultQuestionService).inSingletonScope();
	options.bind(QM_TYPES.QUESTION_CONTROLLER).to(QuestionController).inSingletonScope();
});

export { questionManagementModule, QM_TYPES };
