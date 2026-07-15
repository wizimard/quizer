import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createLogger, format, transports, type Logger } from 'winston';
import type { ILogger, LogMessage } from './logger.interface';
import { injectable } from 'inversify';
import chalk from 'chalk';

type LogLevel = 'info' | 'error' | 'warn' | 'success';

const logLevels = {
	error: 0,
	warn: 1,
	info: 2,
	success: 3,
} as const;

const levelColors = {
	error: chalk.red,
	warn: chalk.yellow,
	info: chalk.blue,
	success: chalk.green,
} as const;

@injectable()
export class LoggerService implements ILogger {
	private correlationId: string | undefined;
	private readonly logger: Logger;

	constructor() {
		const logsDir = join(process.cwd(), 'logs');
		mkdirSync(logsDir, { recursive: true });

		this.logger = createLogger({
			levels: logLevels,
			level: 'success',
			defaultMeta: { pid: process.pid },
			transports: [
				new transports.File({
					filename: join(logsDir, 'app.log'),
					format: format.combine(format.timestamp(), format.json()),
				}),
			],
		});
	}

	setCorrelationId(correlationId: string): void {
		this.correlationId = correlationId;
	}

	private write<T extends LogMessage>(level: LogLevel, data: string | T): void {
		const message = typeof data === 'string' ? data : data.message;

		console.log(levelColors[level](level.toLocaleUpperCase()) + ` [${new Date().toISOString()}] ${this.correlationId} : ${message}`);

		this.logger.log({
			level,
			message: this.getMessage(data),
			correlationId: this.correlationId,
		});
	}

	private getMessage<T extends LogMessage>(data: string | T): string {
		let message = '';

		try {
			message += typeof data === 'string' ? data : JSON.stringify(data, null, 2);
		} catch {
			message += "object can't format to string";
		}

		return message;
	}

	info<T extends LogMessage>(data: string | T): void {
		this.write('info', data);
	}

	error<T extends LogMessage>(data: string | T): void {
		this.write('error', data);
	}

	warn<T extends LogMessage>(data: string | T): void {
		this.write('warn', data);
	}

	success<T extends LogMessage>(data: string | T): void {
		this.write('success', data);
	}
}
