import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { TE_TYPES } from './test-execution.types';
import type { QuestionReadRepository } from './repositories/question-read.repository.interface';
import { PrismaQuestionReadRepository } from './repositories/prisma-question-read.repository';
import { TestExecutionService } from './services/test-execution.service';
import { TestSessionService } from './services/test-session.service';
import { TestExecuteController } from './controllers/test-execute.controller';

const testExecutionModule: ContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind<QuestionReadRepository>(TE_TYPES.QUESTION_READ_REPOSITORY).to(PrismaQuestionReadRepository).inSingletonScope();
	options.bind(TE_TYPES.TEST_EXECUTION_SERVICE).to(TestExecutionService).inSingletonScope();
	options.bind(TE_TYPES.TEST_SESSION_SERVICE).to(TestSessionService).inSingletonScope();
	options.bind(TE_TYPES.TEST_EXECUTE_CONTROLLER).to(TestExecuteController).inSingletonScope();
});

export { testExecutionModule, TE_TYPES };
