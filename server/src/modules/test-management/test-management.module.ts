import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { TM_TYPES } from './test-management.types';
import { DefaultTestService } from './services/test.service';
import { TestController } from './controllers/test.controller';
import { TestHistoryController } from './controllers/test-history.controller';
import { TestSessionController } from './controllers/test-session.controller';
import { TestMiddleware } from './middlewares/test.middleware';
import { TestOwnershipGuard } from './middlewares/test-ownership.guard';
import type { TestRepository } from './interfaces/repository/test.repository.interface';
import { PrismaTestRepository } from './repositories/prisma-test.repository';
import { DefaultTestSessionService } from './services/test-session.service';
import type { TestSessionRepository } from './interfaces/repository/test-session.repository.interface';
import { PrismaTestSessionRepository } from './repositories/prisma-test-session.repository';
import type { TestSettingsRepository } from './interfaces/repository/test-settings.repository.interface';
import { PrismaTestSettingsRepository } from './repositories/prisma-test-settings.repository';
import type { TestSchedulerRepository } from './interfaces/repository/test-scheduler.repository.interface';
import { PrismaTestSchedulerRepository } from './repositories/prisma-test-scheduler.repository';
import { DefaultTestOverviewService } from './services/test-overview.service';
import { DefaultTestSettingsService } from './services/test-settings.service';
import { DefaultTestSchedulerService } from './services/test-scheduler.service';
import { TestSessionListener } from './listeners/test-session.listener';

// TODO: refactor
const testManagementModule: ContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind<TestRepository>(TM_TYPES.TEST_REPOSITORY).to(PrismaTestRepository).inSingletonScope();
	options.bind<TestSessionRepository>(TM_TYPES.TEST_SESSION_REPOSITORY).to(PrismaTestSessionRepository).inSingletonScope();
	options.bind<TestSettingsRepository>(TM_TYPES.TEST_SETTINGS_REPOSITORY).to(PrismaTestSettingsRepository).inSingletonScope();
	options.bind<TestSchedulerRepository>(TM_TYPES.TEST_SCHEDULER_REPOSITORY).to(PrismaTestSchedulerRepository).inSingletonScope();
	options.bind(TM_TYPES.TEST_SERVICE).to(DefaultTestService).inSingletonScope();
	options.bind(TM_TYPES.TEST_CONTROLLER).to(TestController).inSingletonScope();
	options.bind(TM_TYPES.TEST_HISTORY_CONTROLLER).to(TestHistoryController).inSingletonScope();
	options.bind(TM_TYPES.TEST_SESSION_CONTROLLER).to(TestSessionController).inSingletonScope();
	options.bind(TM_TYPES.TEST_MIDDLEWARE).to(TestMiddleware).inSingletonScope();
	options.bind(TM_TYPES.TEST_OWNERSHIP_GUARD).to(TestOwnershipGuard).inSingletonScope();
	options.bind(TM_TYPES.TEST_SESSION_SERVICE).to(DefaultTestSessionService).inSingletonScope();
	options.bind(TM_TYPES.TEST_OVERVIEW_SERVICE).to(DefaultTestOverviewService).inSingletonScope();
	options.bind(TM_TYPES.TEST_SETTINGS_SERVICE).to(DefaultTestSettingsService).inSingletonScope();
	options.bind(TM_TYPES.TEST_SCHEDULER_SERVICE).to(DefaultTestSchedulerService).inSingletonScope();
	options.bind(TM_TYPES.TEST_SESSION_LISTENER).to(TestSessionListener).inSingletonScope();
});

export { testManagementModule, TM_TYPES };
