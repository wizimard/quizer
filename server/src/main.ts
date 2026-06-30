import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Container } from 'inversify';
import { App } from './app';
import { APP_TYPES } from './app.types';
import { LoggerService } from './logger';
import { PrismaService } from '@infrastructure/persistence/database';
import { ConfigService } from './config';
import { authModule } from '@composition/auth.module';
import { userContainer } from '@composition/user.module';
import { RequestLoggerMiddleware } from '@interfaces/http/common/request-logger.middleware';
import { RequestContextMiddleware } from '@interfaces/http/common/request-context.middleware';
import { ExceptionFilter } from './error';
import { SwaggerController } from '@common/swagger.controller';
import { HashService } from '@common/hash.service';
import type { IHashService } from '@common/hash.service.interface';
import { MiddlewareFactory } from '@common/middleware.factory';
import type { IMiddlewareFactory } from '@common/middleware.factory.interface';
import { quizContainer } from '@composition/quiz.module';
import { Bootstrap } from './bootstrap';

export async function bootstrap(): Promise<{ app: App; container: Container }> {
	const container: Container = new Container();

	container.bind(APP_TYPES.APP).to(App).inSingletonScope();
	container.bind(APP_TYPES.LOGGER).to(LoggerService).inSingletonScope();
	container.bind(APP_TYPES.CONFIG).to(ConfigService).inSingletonScope();
	container.bind(APP_TYPES.PRISMA).to(PrismaService).inSingletonScope();
	container.bind(APP_TYPES.REQUEST_CONTEXT_MIDDLEWARE).to(RequestContextMiddleware).inSingletonScope();
	container.bind(APP_TYPES.REQUEST_LOGGER_MIDDLEWARE).to(RequestLoggerMiddleware).inSingletonScope();
	container.bind(APP_TYPES.EXCEPTION_FILTER).to(ExceptionFilter).inSingletonScope();
	container.bind(APP_TYPES.SWAGGER).to(SwaggerController).inSingletonScope();
	container.bind<IHashService>(APP_TYPES.HASH_SERVICE).to(HashService).inSingletonScope();

	container.load(authModule);

	container.bind<IMiddlewareFactory>(APP_TYPES.MIDDLEWARE_FACTORY).to(MiddlewareFactory).inSingletonScope();
	container.load(userContainer);
	container.load(quizContainer);

	const app: App = await Bootstrap.start(container);

	return { app, container };
}

let bootPromise: Promise<{ app: App; container: Container }> | undefined;

export function getBoot(): Promise<{ app: App; container: Container }> {
	bootPromise ??= bootstrap();

	return bootPromise;
}

async function main(): Promise<void> {
	const { app, container } = await bootstrap();

	Bootstrap.registerGracefulShutdown(app, container);
}

const isMainModule = process.argv[1] !== undefined && resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1]);

if (isMainModule) {
	main().catch((error: unknown) => {
		console.error(error);
		process.exit(1);
	});
}
