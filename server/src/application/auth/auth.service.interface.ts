import type { ITokenPair, ITokenPayload } from '@infrastructure/auth/jwt/token.service.interface';

export interface IAuthRequestResponse extends ITokenPair {
	user: ITokenPayload;
}

export interface IAuthService {
	login(email: string, password: string): Promise<IAuthRequestResponse>;
	register(email: string, password: string): Promise<IAuthRequestResponse>;
	refreshTokens(refreshToken: string): Promise<ITokenPair>;
}
