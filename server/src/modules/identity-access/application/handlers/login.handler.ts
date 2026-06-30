import { inject, injectable } from 'inversify';
import { IA_TYPES } from '../../identity-access.types';
import type { LoginCommand } from '../commands/login.command';
import { toAuthResultDto, type AuthResultDto } from '../dto/auth-result.dto';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import type { PasswordHasher } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository.port';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import type { JwtTokenService } from '../../infrastructure/auth/jwt-token.service';

@injectable()
export class LoginHandler {
	constructor(
		@inject(IA_TYPES.USER_REPOSITORY) private readonly userRepository: UserRepository,
		@inject(IA_TYPES.JWT_TOKEN_SERVICE) private readonly tokenService: JwtTokenService,
		@inject(IA_TYPES.PASSWORD_HASHER) private readonly hasher: PasswordHasher,
	) {}

	async execute(command: LoginCommand): Promise<AuthResultDto> {
		const email = Email.of(command.email);
		const password = Password.of(command.password);

		const user = await this.userRepository.findByEmail(email);

		if (!user || !(await user.verifyPassword(password, this.hasher))) {
			throw new InvalidCredentialsError();
		}

		const tokens = this.tokenService.generateAuthTokens(user);

		return toAuthResultDto(user, tokens);
	}
}
