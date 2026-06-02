import { inject, injectable } from 'inversify';
import type { IAuthRequestResponse, IAuthService } from './auth.service.interface';
import type { ITokenPair, ITokenPayload } from './token.service.interface';
import { verifyHash } from '@common/hash';
import { AUTH_TYPES } from '../auth.types';
import type { ITokenService } from './token.service.interface';
import type { UserModel } from '@prisma/client';
import { type IUser, type IUserRepository, USER_TYPES, User } from '@user';
import { HttpError } from '@error';

@injectable()
export class AuthService implements IAuthService {
	constructor(
		@inject(USER_TYPES.USER_REPOSITORY) private readonly userRepository: IUserRepository,
		@inject(AUTH_TYPES.TOKEN_SERVICE) private readonly tokenService: ITokenService,
	) {}

	public async login(email: string, password: string): Promise<IAuthRequestResponse> {
		const user: UserModel | null = await this.userRepository.getByEmail(email);

		if (!user) {
			throw new HttpError(422, 'wrong email or password', 'AuthService');
		}

		const isPasswordValid: boolean = await verifyHash(password, user.password);

		if (!isPasswordValid) {
			throw new HttpError(422, 'wrong email or password', 'AuthService');
		}

		const tokenPayload: ITokenPayload = {
			id: user.id,
			email: user.email,
		};

		return {
			...this.tokenService.generateAuthTokens(tokenPayload),
			user: tokenPayload,
		};
	}

	public async register(email: string, password: string): Promise<IAuthRequestResponse> {
		const existingUser: UserModel | null = await this.userRepository.getByEmail(email);

		if (existingUser) {
			throw new HttpError(422, 'email is busy', 'AuthService');
		}

		const userEntity: IUser = new User(email);
		await userEntity.setPassword(password);

		const createdUser: UserModel | null = await this.userRepository.create(userEntity);

		if (!createdUser) {
			throw new HttpError(500, 'user not created', 'AuthService');
		}

		const tokenPayload: ITokenPayload = {
			id: createdUser.id,
			email: createdUser.email,
		};

		return {
			...this.tokenService.generateAuthTokens(tokenPayload),
			user: tokenPayload,
		};
	}

	public async refreshTokens(refreshToken: string): Promise<ITokenPair> {
		const payload = this.tokenService.verifyRefreshToken(refreshToken);

		if (!payload) {
			throw new HttpError(401, 'invalid token credentials', '[AuthService]');
		}

		return this.tokenService.generateAuthTokens({
			id: payload.id,
			email: payload.email,
		});
	}
}
