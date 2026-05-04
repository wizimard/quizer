import { configDotenv, type DotenvParseOutput } from 'dotenv';
import { injectable } from 'inversify';
import type { IConfigService } from './config.service.interface';
import { HttpError } from '@error';

@injectable()
export class ConfigService implements IConfigService {
	private parsedConfig: DotenvParseOutput;

	constructor() {
		const result = configDotenv();

		if (result.error || !result.parsed) {
			throw new HttpError(500, "Can't parse config", 'ConfigService');
		}

		this.parsedConfig = result.parsed;
	}

	public get<T extends string | number | boolean>(key: string): T | never {
		if (!this.parsedConfig[key]) {
			throw new HttpError(500, '${key} not found', 'ConfigService');
		}

		return this.parsedConfig[key] as T;
	}
}
