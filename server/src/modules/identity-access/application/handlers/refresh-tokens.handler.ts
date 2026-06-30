import { inject, injectable } from 'inversify';
import { HttpError } from '@shared/error';
import { IA_TYPES } from '../../identity-access.types';
import type { ITokenPair, ITokenService } from '../../infrastructure/auth/token.service.interface';

@injectable()
export class RefreshTokensHandler {
	constructor(@inject(IA_TYPES.TOKEN_SERVICE) private readonly tokenService: ITokenService) {}

	async execute(refreshToken: string): Promise<ITokenPair> {
		const payload = this.tokenService.verifyRefreshToken(refreshToken);

		if (!payload) {
			throw new HttpError(401, 'invalid token credentials', '[RefreshTokensHandler]');
		}

		return this.tokenService.generateAuthTokens(payload);
	}
}
