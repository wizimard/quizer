import { inject, injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { APP_TYPES } from '@app_types';
import type { IConfigService } from '@config';
import { HttpError } from '@error';
import type { IHashService } from './hash.service.interface';

@injectable()
export class HashService implements IHashService {
	private readonly saltRounds: number;

	constructor(@inject(APP_TYPES.CONFIG) configService: IConfigService) {
		const saltRounds = parseInt(configService.get<string>('HASH_SALT'), 10);

		if (!Number.isFinite(saltRounds) || saltRounds < 1) {
			throw new HttpError(500, 'HASH_SALT must be a positive integer', 'HashService');
		}

		this.saltRounds = saltRounds;
	}

	hash(data: string): Promise<string> {
		return bcrypt.hash(data, this.saltRounds);
	}

	verifyHash(data: string, hashed: string): Promise<boolean> {
		return bcrypt.compare(data, hashed);
	}
}
