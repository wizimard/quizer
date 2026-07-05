import type { AuthResultDto } from '../dto/auth-result.dto';

export interface AuthLoginHttpResponse {
	accessToken: string;
	user: {
		email: string;
	};
}

export class AuthResponseMapper {
	static toLoginHttp(result: AuthResultDto): AuthLoginHttpResponse {
		return {
			accessToken: result.accessToken,
			user: { email: result.user.email },
		};
	}

	static toRegisterHttp(result: AuthResultDto): AuthLoginHttpResponse {
		return AuthResponseMapper.toLoginHttp(result);
	}
}
