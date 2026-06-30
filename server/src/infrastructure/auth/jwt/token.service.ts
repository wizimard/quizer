import { inject, injectable } from 'inversify';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import type { ITokenPayload, ITokenPair, ITokenService } from './token.service.interface';
import { APP_TYPES } from '@app_types';
import type { IConfigService } from '@config';

@injectable()
export class TokenService implements ITokenService {
	private readonly accessSecret: Secret;
	private readonly refreshSecret: Secret;
	private readonly accessExpiresIn: NonNullable<SignOptions['expiresIn']>;
	private readonly refreshExpiresIn: NonNullable<SignOptions['expiresIn']>;

	constructor(@inject(APP_TYPES.CONFIG) private readonly configService: IConfigService) {
		this.accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
		this.refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

		this.accessExpiresIn = this.configService.get<NonNullable<SignOptions['expiresIn']>>('ACCESS_TOKEN_EXPIRES_IN');
		this.refreshExpiresIn = this.configService.get<NonNullable<SignOptions['expiresIn']>>('REFRESH_TOKEN_EXPIRES_IN');
	}

	public generateAuthTokens(payload: ITokenPayload): ITokenPair {
		const accessToken = this.signToken(payload, this.accessSecret, this.accessExpiresIn);
		const refreshToken = this.signToken(payload, this.refreshSecret, this.refreshExpiresIn);

		return { accessToken, refreshToken };
	}

	public verifyAccessToken(token: string): ITokenPayload | null {
		return this.verifyToken(token, this.accessSecret);
	}

	public verifyRefreshToken(token: string): ITokenPayload | null {
		return this.verifyToken(token, this.refreshSecret);
	}

	private verifyToken(token: string, secret: Secret): ITokenPayload | null {
		try {
			return jwt.verify(token, secret) as ITokenPayload;
		} catch {
			return null;
		}
	}

	private signToken(payload: ITokenPayload, secret: Secret, expiresIn: NonNullable<SignOptions['expiresIn']>): string {
		return jwt.sign(payload, secret, { expiresIn });
	}
}
