import type { ITokenPair } from './token.service.interface';

export interface IAuthService {
	login(email: string, password: string): Promise<ITokenPair>;
	register(email: string, password: string): Promise<ITokenPair>;
	refreshTokens(id: string, email: string): Promise<ITokenPair>;
}
