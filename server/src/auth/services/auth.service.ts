import { inject, injectable } from 'inversify';
import type { IAuthService } from './auth.service.interface';
import type { ITokenPair } from './token.service.interface';
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

	public async login(email: string, password: string): Promise<ITokenPair> {
		const user: UserModel | null = await this.userRepository.getByEmail(email);

		if (!user) {
			throw new HttpError(400, 'wrong email or password', 'AuthService');
		}

		const isPasswordValid: boolean = await verifyHash(password, user.password);

		if (!isPasswordValid) {
			throw new HttpError(400, 'wrong email or password', 'AuthService');
		}

		return this.tokenService.generateAuthTokens({
			id: user.id,
			email: user.email,
		});
	}

	public async register(email: string, password: string): Promise<ITokenPair> {
		const existingUser: UserModel | null = await this.userRepository.getByEmail(email);

		if (existingUser) {
			throw new HttpError(400, 'email is busy', 'AuthService');
		}

		const userEntity: IUser = new User(email);
		await userEntity.setPassword(password);

		const createdUser: UserModel | null = await this.userRepository.create(userEntity);

		if (!createdUser) {
			throw new HttpError(500, 'user not created', 'AuthService');
		}

		return this.tokenService.generateAuthTokens({
			id: createdUser.id,
			email: createdUser.email,
		});
	}

	public async refreshTokens(id: string, email: string): Promise<ITokenPair> {
		return this.tokenService.generateAuthTokens({
			id,
			email,
		});
	}
}
