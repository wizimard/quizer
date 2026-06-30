import type { ITokenPair, ITokenPayload } from '../../infrastructure/auth/token.service.interface';
import type { User } from '../../domain/entities/user.entity';
import { toTokenPayload } from '../mappers/to-token-payload';

export interface AuthResultDto extends ITokenPair {
	user: ITokenPayload;
}

export function toAuthResultDto(user: User, tokens: ITokenPair): AuthResultDto {
	const userPayload = toTokenPayload(user);

	return {
		...tokens,
		user: userPayload,
	};
}
