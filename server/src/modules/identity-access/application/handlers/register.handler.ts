import { inject, injectable } from 'inversify';
import { IA_TYPES } from '../../identity-access.types';
import type { RegisterCommand } from '../commands/register.command';
import { toAuthResultDto, type AuthResultDto } from '../dto/auth-result.dto';
import { EmailAlreadyTakenError } from '../../domain/errors/email-already-taken.error';
import { User, type PasswordHasher } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository.port';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import type { JwtTokenService } from '../../infrastructure/auth/jwt-token.service';

@injectable()
export class RegisterHandler {
	constructor(
		@inject(IA_TYPES.USER_REPOSITORY) private readonly userRepository: UserRepository,
		@inject(IA_TYPES.JWT_TOKEN_SERVICE) private readonly tokenService: JwtTokenService,
		@inject(IA_TYPES.PASSWORD_HASHER) private readonly hasher: PasswordHasher,
	) {}

	async execute(command: RegisterCommand): Promise<AuthResultDto> {
		const email = Email.of(command.email);
		const password = Password.of(command.password);

		if (await this.userRepository.existsByEmail(email)) {
			throw new EmailAlreadyTakenError();
		}

		const user = await User.create(email, password, this.hasher);
		const createdUser = await this.userRepository.create(user);
		const tokens = this.tokenService.generateAuthTokens(createdUser);

		return toAuthResultDto(createdUser, tokens);
	}
}
