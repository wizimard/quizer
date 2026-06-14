import { Container } from 'inversify';
import { App } from './app';
import { APP_TYPES } from './app.types';
import { LoggerService } from './logger';
import { PrismaService } from './database';
import { ConfigService } from './config';
import { authModule } from './auth';
import { userContainer } from './user';
import { RequestLoggerMiddleware } from './common/request-logger.middleware';
import { ExceptionFilter } from './error';
import { SwaggerController } from '@common/swagger.controller';
import { quizContainer } from './quiz';

async function bootstrap(): Promise<{ app: App; container: Container }> {
	const container: Container = new Container();

	container.bind(APP_TYPES.APP).to(App).inSingletonScope();
	container.bind(APP_TYPES.LOGGER).to(LoggerService).inSingletonScope();
	container.bind(APP_TYPES.CONFIG).to(ConfigService).inSingletonScope();
	container.bind(APP_TYPES.PRISMA).to(PrismaService).inSingletonScope();
	container.bind(APP_TYPES.REQUEST_LOGGER_MIDDLEWARE).to(RequestLoggerMiddleware).inSingletonScope();
	container.bind(APP_TYPES.EXCEPTION_FILTER).to(ExceptionFilter).inSingletonScope();
	container.bind(APP_TYPES.SWAGGER).to(SwaggerController).inSingletonScope();

	container.load(authModule);
	container.load(userContainer);
	container.load(quizContainer);

	const app: App = container.get(APP_TYPES.APP);

	await app.start();

	return { app, container };
}

export const boot = bootstrap();
