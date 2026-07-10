import type { AuthResultDto } from '@modules/identity-access/dto/auth-result.dto';
import type { ILoginInput } from '../inputs/login.input';
import type { IRegisterInput } from '../inputs/register.input';
import type { ITokenPair } from './token.service.interface';

export interface IAuthService {
	register(input: IRegisterInput): Promise<AuthResultDto>;
	login(input: ILoginInput): Promise<AuthResultDto>;
	refreshTokens(refreshToken: string): Promise<ITokenPair>;
}
