import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import type { IHashService } from './hash.service.interface';
import type { PasswordHasher } from '../../domain/entities/user.entity';

@injectable()
export class BcryptHashService implements PasswordHasher {
	constructor(@inject(APP_TYPES.HASH_SERVICE) private readonly hashService: IHashService) {}

	hash(plain: string): Promise<string> {
		return this.hashService.hash(plain);
	}

	verify(plain: string, hash: string): Promise<boolean> {
		return this.hashService.verifyHash(plain, hash);
	}
}
