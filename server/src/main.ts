import { Container } from 'inversify';
import { App } from './app';
import { APP_TYPES } from './app.types';
import { LoggerService } from './logger/logger.service';
import { PrismaService } from './database/prisma.service';
import { ConfigService } from './config/config.service';
import { authModule } from './auth';
import { userContainer } from './user';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';

async function bootstrap(): Promise<{ app: App; container: Container }> {
	const container: Container = new Container();

	container.bind(APP_TYPES.APP).to(App).inSingletonScope();
	container.bind(APP_TYPES.LOGGER).to(LoggerService).inSingletonScope();
	container.bind(APP_TYPES.CONFIG).to(ConfigService).inSingletonScope();
	container.bind(APP_TYPES.PRISMA).to(PrismaService).inSingletonScope();
	container.bind(APP_TYPES.REQUEST_LOGGER_MIDDLEWARE).to(RequestLoggerMiddleware).inSingletonScope();

	container.load(authModule);
	container.load(userContainer);

	const app: App = container.get(APP_TYPES.APP);

	await app.start();

	return { app, container };
}

bootstrap();
