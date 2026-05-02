import type { ILogger } from './logger.interface';
import chalk from 'chalk';
import dedent from 'dedent';
import { injectable } from 'inversify';

@injectable()
export class LoggerService implements ILogger {
	info(message: string): void {
		console.log(chalk.gray('[INFO]') + ' ' + dedent(message));
	}
	error(message: string): void {
		console.log(chalk.red('[ERROR]') + ' ' + dedent(message));
	}
	warn(message: string): void {
		console.log(chalk.yellow('[WARN]') + ' ' + dedent(message));
	}

	success(message: string): void {
		console.log(chalk.green('[SUCCESS]') + ' ' + dedent(message));
	}
}
