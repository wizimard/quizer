import type { ITokenPayload } from '../../infrastructure/auth/token.service.interface';
import type { User } from '../../domain/entities/user.entity';

export function toTokenPayload(user: User): ITokenPayload {
	return {
		id: user.id.value,
		email: user.email.value,
	};
}
