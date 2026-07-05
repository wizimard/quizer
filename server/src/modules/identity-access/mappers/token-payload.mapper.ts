import type { ITokenPayload } from '../interfaces/token.service.interface';
import type { User } from '../entities/user.entity';

export function toTokenPayload(user: User): ITokenPayload {
	return {
		id: user.id.value,
		email: user.email.value,
	};
}
