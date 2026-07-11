import type { ITokenPair, ITokenPayload } from '../interfaces/services/token.service.interface';
import type { User } from '../entities/user.entity';
import { toTokenPayload } from '../mappers/token-payload.mapper';

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
