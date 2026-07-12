import type { ILogger } from './logger.interface';
import { injectable } from 'inversify';

type LogLevel = 'info' | 'error' | 'warn' | 'success';

@injectable()
export class LoggerService implements ILogger {
	private write(level: LogLevel, message: string): void {
		console.log(
			JSON.stringify(
				{
					pid: process.pid,
					level,
					timestamp: new Date().toISOString(),
					message,
				},
				null,
				4,
			),
		);
	}

	private getMessage(data: string | object): string {
		let message = '';

		try {
			message += typeof data === 'string' ? data : JSON.stringify(data, null, 2);
		} catch (error) {
			message += "object can't format to string";
		}

		return message;
	}

	info(...data: unknown[]): void {
		this.write('info', this.getMessage(data));
	}

	error(...data: unknown[]): void {
		this.write('error', this.getMessage(data));
	}

	warn(...data: unknown[]): void {
		this.write('warn', this.getMessage(data));
	}

	success(...data: unknown[]): void {
		this.write('success', this.getMessage(data));
	}
}
