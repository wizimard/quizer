import type { ITokenPayload } from '@infrastructure/auth/jwt/token.service.interface';

export function toTokenPayload(user: { id: string; email: string }): ITokenPayload {
	return {
		id: user.id,
		email: user.email,
	};
}
