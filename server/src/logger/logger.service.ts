import type { ILogger } from './logger.interface';
import { injectable } from 'inversify';

type LogLevel = 'info' | 'error' | 'warn' | 'success';

@injectable()
export class LoggerService implements ILogger {
	private write(level: LogLevel, message: string): void {
		console.log(
			JSON.stringify({
				level,
				message,
				timestamp: new Date().toISOString(),
			}),
		);
	}

	info(message: string): void {
		this.write('info', message);
	}

	error(message: string): void {
		this.write('error', message);
	}

	warn(message: string): void {
		this.write('warn', message);
	}

	success(message: string): void {
		this.write('success', message);
	}
}
