import { inject, injectable } from 'inversify';
import { randomUUID } from 'crypto';
import type { IAuthRequestResponse, IAuthService } from './auth.service.interface';
import type { ITokenPair } from '@infrastructure/auth/jwt/token.service.interface';
import { APP_TYPES } from '@app_types';
import type { IHashService } from '@common/hash.service.interface';
import { AUTH_TYPES } from '@composition/auth.types';
import type { ITokenService } from '@infrastructure/auth/jwt/token.service.interface';
import type { UserModel } from '@prisma/client';
import type { IUser } from '@domain/user/user.entity.interface';
import { User } from '@domain/user/user.entity';
import type { IUserRepository } from '@infrastructure/persistence/prisma/user.repository.interface';
import { USER_TYPES } from '@composition/user.types';
import { HttpError } from '@error';
import { toTokenPayload } from './to-token-payload';

@injectable()
export class AuthService implements IAuthService {
	constructor(
		@inject(USER_TYPES.USER_REPOSITORY) private readonly userRepository: IUserRepository,
		@inject(AUTH_TYPES.TOKEN_SERVICE) private readonly tokenService: ITokenService,
		@inject(APP_TYPES.HASH_SERVICE) private readonly hashService: IHashService,
	) {}

	public async login(email: string, password: string): Promise<IAuthRequestResponse> {
		const user: UserModel | null = await this.userRepository.getByEmail(email);

		if (!user) {
			throw new HttpError(422, 'wrong email or password', 'AuthService');
		}

		const isPasswordValid: boolean = await this.hashService.verifyHash(password, user.password);

		if (!isPasswordValid) {
			throw new HttpError(422, 'wrong email or password', 'AuthService');
		}

		const tokenPayload = toTokenPayload(user);

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

		const userEntity: IUser = new User(randomUUID(), email);
		await userEntity.setPassword(password, (value: string) => this.hashService.hash(value));

		const createdUser: UserModel | null = await this.userRepository.create(userEntity);

		if (!createdUser) {
			throw new HttpError(500, 'user not created', 'AuthService');
		}

		const tokenPayload = toTokenPayload(createdUser);

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

		return this.tokenService.generateAuthTokens(toTokenPayload(payload));
	}
}
