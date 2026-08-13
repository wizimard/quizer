import { configDotenv, type DotenvParseOutput } from 'dotenv';
import { injectable } from 'inversify';
import type { IConfigService } from './config.service.interface';
import { HttpError } from '@shared/error';

@injectable()
export class ConfigService implements IConfigService {
	private parsedConfig: DotenvParseOutput;

	constructor() {
		configDotenv();

		// Prefer process.env so Docker/K8s injected variables work without a local .env file
		this.parsedConfig = Object.fromEntries(
			Object.entries(process.env).filter((entry): entry is [string, string] => entry[1] !== undefined),
		);

		if (Object.keys(this.parsedConfig).length === 0) {
			throw new HttpError(500, "Can't parse config", 'ConfigService');
		}
	}

	public get<T extends string | number | boolean>(key: string): T | never {
		if (!this.parsedConfig[key]) {
			throw new HttpError(500, `${key} not found`, 'ConfigService');
		}

		return this.parsedConfig[key] as T;
	}

	public getOptional<T extends string | number | boolean>(key: string): T | undefined {
		const value = this.parsedConfig[key];

		if (value === undefined || value === '') {
			return undefined;
		}

		return value as T;
	}
}
