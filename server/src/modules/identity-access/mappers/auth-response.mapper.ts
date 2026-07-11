import type { AuthResultDto } from '../dto/auth-result.dto';

export interface AuthLoginHttpResponse {
	accessToken: string;
	user: {
		id: string;
		email: string;
	};
}

export class AuthResponseMapper {
	static toLoginHttp(result: AuthResultDto): AuthLoginHttpResponse {
		return {
			accessToken: result.accessToken,
			user: { id: result.user.id, email: result.user.email },
		};
	}

	static toRegisterHttp(result: AuthResultDto): AuthLoginHttpResponse {
		return AuthResponseMapper.toLoginHttp(result);
	}
}
