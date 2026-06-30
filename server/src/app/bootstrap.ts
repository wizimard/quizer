import type { Container } from 'inversify';
import { APP_TYPES } from './app.types';
import type { App } from './app';
import type { ILogger } from '@shared/logger';
import type { IPrismaService } from '@shared/persistence';
import { registerProcessHandlers } from '@shared/http/process-handlers';

export class Bootstrap {
	static async start(container: Container): Promise<App> {
		const prismaService: IPrismaService = container.get<IPrismaService>(APP_TYPES.PRISMA);
		const logger: ILogger = container.get<ILogger>(APP_TYPES.LOGGER);

		registerProcessHandlers(logger);

		await prismaService.connect();
		logger.success('[Bootstrap] database connected');

		const app: App = container.get<App>(APP_TYPES.APP);
		await app.start();

		return app;
	}

	static async stop(app: App, container: Container): Promise<void> {
		const logger: ILogger = container.get<ILogger>(APP_TYPES.LOGGER);

		await app.stop();

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
