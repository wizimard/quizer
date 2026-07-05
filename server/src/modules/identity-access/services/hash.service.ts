import { inject, injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { APP_TYPES } from '@app/app.types';
import type { IConfigService } from '@shared/config';
import { HttpError } from '@shared/error';
import type { IHashService } from '../interfaces/hash.service.interface';
import type { PasswordHasher } from '../entities/user.entity';

@injectable()
export class HashService implements IHashService, PasswordHasher {
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

	verify(plain: string, hash: string): Promise<boolean> {
		return this.verifyHash(plain, hash);
	}
}
