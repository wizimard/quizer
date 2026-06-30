import type { ILogger } from '@logger';

export function registerProcessHandlers(logger: ILogger): void {
	process.on('unhandledRejection', (reason: unknown) => {
		const message = reason instanceof Error ? reason.stack ?? reason.message : String(reason);
		logger.error(`Unhandled rejection: ${message}`);
	});

	process.on('uncaughtException', (error: Error) => {
		logger.error(`Uncaught exception: ${error.stack ?? error.message}`);
		process.exit(1);
	});
}
