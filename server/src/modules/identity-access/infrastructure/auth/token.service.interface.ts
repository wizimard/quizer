export interface ITokenPair {
	accessToken: string;
	refreshToken: string;
}

export interface ITokenPayload {
	id: string;
	email: string;
}

export interface ITokenService {
	generateAuthTokens(payload: ITokenPayload): ITokenPair;
	verifyRefreshToken(token: string): ITokenPayload | null;
	verifyAccessToken(token: string): ITokenPayload | null;
}
