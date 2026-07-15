import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { TM_TYPES } from './test-management.types';
import type { QuestionRepository } from './interfaces/repository/question.repository.interface';
import { PrismaQuestionRepository } from './repositories/prisma-question.repository';
import { TestService } from './services/test.service';
import { QuestionService } from './services/question.service';
import { TestController } from './controllers/test.controller';
import { QuestionController } from './controllers/question.controller';
import { TestMiddleware } from './middlewares/test.middleware';
import { TestOwnershipGuard } from './middlewares/test-ownership.guard';
import type { TestRepository } from './interfaces/repository/test.repository.interface';
import { PrismaTestRepository } from './repositories/prisma-test.repository';
import type { TestExecutionRepository } from './interfaces/repository/test-execution.repository.interface';
import { PrismaTestExecutionRepository } from './repositories/prisma-test-execution.repository';
import { TestSessionService } from './services/test-session.service';
import { QuestionExistsGuard } from './middlewares/question-exists.guard';

const testManagementModule: ContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind<TestRepository>(TM_TYPES.TEST_REPOSITORY).to(PrismaTestRepository).inSingletonScope();
	options.bind<TestExecutionRepository>(TM_TYPES.TEST_EXECUTION_REPOSITORY).to(PrismaTestExecutionRepository).inSingletonScope();
	options.bind<QuestionRepository>(TM_TYPES.QUESTION_REPOSITORY).to(PrismaQuestionRepository).inSingletonScope();
	options.bind(TM_TYPES.TEST_SERVICE).to(TestService).inSingletonScope();
	options.bind(TM_TYPES.QUESTION_SERVICE).to(QuestionService).inSingletonScope();
	options.bind(TM_TYPES.TEST_CONTROLLER).to(TestController).inSingletonScope();
	options.bind(TM_TYPES.QUESTION_CONTROLLER).to(QuestionController).inSingletonScope();
	options.bind(TM_TYPES.TEST_MIDDLEWARE).to(TestMiddleware).inSingletonScope();
	options.bind(TM_TYPES.TEST_OWNERSHIP_GUARD).to(TestOwnershipGuard).inSingletonScope();
	options.bind(TM_TYPES.TEST_SESSION_SERVICE).to(TestSessionService).inSingletonScope();
	options.bind(TM_TYPES.QUESTION_EXISTS_GUARD).to(QuestionExistsGuard).inSingletonScope();
});

export { testManagementModule, TM_TYPES };
