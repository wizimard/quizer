import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { APP_TYPES } from './app.types';
import { App } from './app';
import { LoggerService } from '@shared/logger';
import { PostgresListenService, PrismaService } from '@shared/persistence';
import { ConfigService } from '@shared/config';
import { WebSocketService } from '@shared/websocket';
import { RequestLoggerMiddleware } from '@shared/http/request-logger.middleware';
import { RequestMetadataMiddleware } from '@shared/http/request-metadata.middleware';
import { ExceptionFilter } from '@shared/error';
import { SwaggerController } from '@shared/http/swagger.controller';
import { identityAccessModule } from '@modules/identity-access/identity-access.module';
import { testManagementModule } from '@modules/test-management/test-management.module';
import { questionManagementModule } from '@modules/question-management/question-management.module';
import { testExecutionModule } from '@modules/test-execution/test-execution.module';

const coreModule: ContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind(APP_TYPES.APP).to(App).inSingletonScope();
	options.bind(APP_TYPES.LOGGER).to(LoggerService).inSingletonScope();
	options.bind(APP_TYPES.CONFIG).to(ConfigService).inSingletonScope();
	options.bind(APP_TYPES.PRISMA).to(PrismaService).inSingletonScope();
	options.bind(APP_TYPES.POSTGRES_LISTEN).to(PostgresListenService).inSingletonScope();
	options.bind(APP_TYPES.WEBSOCKET).to(WebSocketService).inSingletonScope();
	options.bind(APP_TYPES.REQUEST_METADATA_MIDDLEWARE).to(RequestMetadataMiddleware).inSingletonScope();
	options.bind(APP_TYPES.REQUEST_LOGGER_MIDDLEWARE).to(RequestLoggerMiddleware).inSingletonScope();
	options.bind(APP_TYPES.EXCEPTION_FILTER).to(ExceptionFilter).inSingletonScope();
	options.bind(APP_TYPES.SWAGGER).to(SwaggerController).inSingletonScope();
});

const appModules: ContainerModule[] = [coreModule, identityAccessModule, testManagementModule, questionManagementModule, testExecutionModule];

export { coreModule, appModules };
