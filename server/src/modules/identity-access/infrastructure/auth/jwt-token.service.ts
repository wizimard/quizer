import { inject, injectable } from 'inversify';
import type { ITokenPair } from './token.service.interface';
import { IA_TYPES } from '../../identity-access.types';
import type { ITokenService } from './token.service.interface';
import type { User } from '../../domain/entities/user.entity';
import { toTokenPayload } from '../../application/mappers/to-token-payload';

@injectable()
export class JwtTokenService {
	constructor(@inject(IA_TYPES.TOKEN_SERVICE) private readonly tokenService: ITokenService) {}

	generateAuthTokens(user: User): ITokenPair {
		return this.tokenService.generateAuthTokens(toTokenPayload(user));
	}
}
