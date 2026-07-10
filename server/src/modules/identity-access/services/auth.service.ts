import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import { HttpError } from '@shared/error';
import { IA_TYPES } from '../identity-access.types';
import { toAuthResultDto, type AuthResultDto } from '../dto/auth-result.dto';
import { InvalidCredentialsError } from '../utils/errors/invalid-credentials.error';
import { EmailAlreadyTakenError } from '../utils/errors/email-already-taken.error';
import { User, type PasswordHasher } from '../entities/user.entity';
import type { UserRepository } from '../interfaces/user.repository.interface';
import type { ITokenPair } from '../interfaces/services/token.service.interface';
import { Email } from '../entities/email';
import { Password } from '../entities/password';
import { TokenService } from './token.service';
import type { ILoginInput } from '../interfaces/inputs/login.input';
import type { IRegisterInput } from '../interfaces/inputs/register.input';
import type { IAuthService } from '../interfaces/services/auth.service.interface';

@injectable()
export class AuthService implements IAuthService {
	constructor(
		@inject(IA_TYPES.USER_REPOSITORY) private readonly userRepository: UserRepository,
		@inject(IA_TYPES.TOKEN_SERVICE) private readonly tokenService: TokenService,
		@inject(APP_TYPES.HASH_SERVICE) private readonly hasher: PasswordHasher,
	) {}

	async login(input: ILoginInput): Promise<AuthResultDto> {
		const email = Email.of(input.email);
		const password = Password.of(input.password);

		const user = await this.userRepository.findByEmail(email);

		if (!user || !(await user.verifyPassword(password, this.hasher))) {
			throw new InvalidCredentialsError();
		}

		const tokens = this.tokenService.generateAuthTokensForUser(user);

		return toAuthResultDto(user, tokens);
	}

	async register(input: IRegisterInput): Promise<AuthResultDto> {
		const email = Email.of(input.email);
		const password = Password.of(input.password);

		if (await this.userRepository.existsByEmail(email)) {
			throw new EmailAlreadyTakenError();
		}

		const user = await User.create(email, password, this.hasher);
		const createdUser = await this.userRepository.create(user);
		const tokens = this.tokenService.generateAuthTokensForUser(createdUser);

		return toAuthResultDto(createdUser, tokens);
	}

	async refreshTokens(refreshToken: string): Promise<ITokenPair> {
		const payload = this.tokenService.verifyRefreshToken(refreshToken);

		if (!payload) {
			throw new HttpError(401, 'invalid token credentials', '[RefreshTokensHandler]');
		}

		return this.tokenService.generateAuthTokens(payload);
	}
}
