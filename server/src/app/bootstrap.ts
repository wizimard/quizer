import type { Container } from 'inversify';
import { APP_TYPES } from './app.types';
import type { App } from './app';
import type { ILogger } from '@shared/logger';
import type { IPostgresListenService, IPrismaService } from '@shared/persistence';
import { registerProcessHandlers } from '@shared/http/process-handlers';
import { TM_TYPES } from '@modules/test-management/test-management.types';
import type { TestSessionCloseScheduler } from '@modules/test-management/interfaces/services/test-session-close-scheduler.service.interface';
import { TE_TYPES } from '@modules/test-execution/test-execution.types';

export class Bootstrap {
	static async start(container: Container): Promise<App> {
		const prismaService: IPrismaService = container.get<IPrismaService>(APP_TYPES.PRISMA);
		const postgresListenService: IPostgresListenService = container.get<IPostgresListenService>(APP_TYPES.POSTGRES_LISTEN);
		const logger: ILogger = container.get<ILogger>(APP_TYPES.LOGGER);

		registerProcessHandlers(logger);

		await prismaService.connect();
		logger.success('[Bootstrap] database connected');

		await postgresListenService.connect();
		logger.success('[Bootstrap] postgres listen connected');

		Bootstrap.subscribeDbListeners(container);
		logger.success('[Bootstrap] db listeners subscribed');

		const testSessionCloseScheduler: TestSessionCloseScheduler = container.get<TestSessionCloseScheduler>(TM_TYPES.TEST_SESSION_CLOSE_SCHEDULER);
		await testSessionCloseScheduler.start();
		logger.success('[Bootstrap] test session close scheduler started');

		const app: App = container.get<App>(APP_TYPES.APP);
		await app.start();

		return app;
	}

	private static subscribeDbListeners(container: Container): void {
		container.get(TM_TYPES.TEST_SESSION_LISTENER);
		container.get(TE_TYPES.TEST_REGISTRATION_LISTENER);
		container.get(TE_TYPES.TEST_ANSWER_LISTENER);
	}

	static async stop(app: App, container: Container): Promise<void> {
		const logger: ILogger = container.get<ILogger>(APP_TYPES.LOGGER);

		await app.stop();

		const testSessionCloseScheduler: TestSessionCloseScheduler = container.get<TestSessionCloseScheduler>(TM_TYPES.TEST_SESSION_CLOSE_SCHEDULER);
		await testSessionCloseScheduler.stop();

		const postgresListenService: IPostgresListenService = container.get<IPostgresListenService>(APP_TYPES.POSTGRES_LISTEN);
		await postgresListenService.disconnect();

		const prismaService: IPrismaService = container.get<IPrismaService>(APP_TYPES.PRISMA);
		await prismaService.disconnect();

		logger.success('[Bootstrap] shutdown complete');
	}

	static registerGracefulShutdown(app: App, container: Container): void {
		const logger: ILogger = container.get<ILogger>(APP_TYPES.LOGGER);

		const shutdown = async (signal: string): Promise<void> => {
			logger.info(`Received ${signal}, shutting down`);

			try {
				await Bootstrap.stop(app, container);
				process.exit(0);
			} catch (error: unknown) {
				const message = error instanceof Error ? error.message : String(error);
				logger.error(`Shutdown failed: ${message}`);
				process.exit(1);
			}
		};

		process.on('SIGTERM', () => {
			void shutdown('SIGTERM');
		});

		process.on('SIGINT', () => {
			void shutdown('SIGINT');
		});
	}
}
