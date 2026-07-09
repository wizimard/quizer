import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { APP_TYPES } from './app.types';
import { App } from './app';
import { LoggerService } from '@shared/logger';
import { PrismaService } from '@shared/persistence';
import { ConfigService } from '@shared/config';
import { RequestLoggerMiddleware } from '@shared/http/request-logger.middleware';
import { RequestContextMiddleware } from '@shared/http/request-context.middleware';
import { ExceptionFilter } from '@shared/error';
import { SwaggerController } from '@shared/http/swagger.controller';
import { MiddlewareFactory } from '@shared/http/middleware.factory';
import type { IMiddlewareFactory } from '@shared/http/middleware.factory.interface';
import { identityAccessModule } from '@modules/identity-access/identity-access.module';
import { testManagementModule } from '@modules/test-management/test-management.module';
import { testExecutionModule } from '@modules/test-execution/test-execution.module';

const coreModule: ContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind(APP_TYPES.APP).to(App).inSingletonScope();
	options.bind(APP_TYPES.LOGGER).to(LoggerService).inSingletonScope();
	options.bind(APP_TYPES.CONFIG).to(ConfigService).inSingletonScope();
	options.bind(APP_TYPES.PRISMA).to(PrismaService).inSingletonScope();
	options.bind(APP_TYPES.REQUEST_CONTEXT_MIDDLEWARE).to(RequestContextMiddleware).inSingletonScope();
	options.bind(APP_TYPES.REQUEST_LOGGER_MIDDLEWARE).to(RequestLoggerMiddleware).inSingletonScope();
	options.bind(APP_TYPES.EXCEPTION_FILTER).to(ExceptionFilter).inSingletonScope();
	options.bind(APP_TYPES.SWAGGER).to(SwaggerController).inSingletonScope();
	options.bind<IMiddlewareFactory>(APP_TYPES.MIDDLEWARE_FACTORY).to(MiddlewareFactory).inSingletonScope();
});

const appModules: ContainerModule[] = [coreModule, identityAccessModule, testManagementModule, testExecutionModule];

export { coreModule, appModules };
