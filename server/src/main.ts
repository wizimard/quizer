import { Container } from 'inversify';
import { App } from './app';
import { APP_TYPES } from './app.types';
import { LoggerService } from './logger/logger.service';
import { PrismaService } from './database/prisma.service';

async function bootstrap(): Promise<{ app: App; container: Container }> {
	const container = new Container();

	container.bind(APP_TYPES.APP).to(App).inSingletonScope();
	container.bind(APP_TYPES.LOGGER).to(LoggerService).inSingletonScope();
	container.bind(APP_TYPES.PRISMA).to(PrismaService).inSingletonScope();

	const app: App = container.get(APP_TYPES.APP);

	await app.start();

	return { app, container };
}

bootstrap();
