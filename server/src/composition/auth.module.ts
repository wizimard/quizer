import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { AUTH_TYPES } from './auth.types';
import { AuthController } from '@interfaces/http/auth/auth.controller';
import { TokenService } from '@infrastructure/auth/jwt/token.service';
import { AuthService } from '@application/auth/auth.service';
import type { ITokenPayload } from '@infrastructure/auth/jwt/token.service.interface';
import { AuthMiddleware } from '@interfaces/http/auth/auth.middleware';
import { AuthGuard } from '@interfaces/http/auth/auth.guard';
import { RefreshTokenCookieService } from '@infrastructure/auth/refresh-token-cookie.service';
import type { IRefreshTokenCookieService } from '@infrastructure/auth/refresh-token-cookie.service.interface';

const authModule: ContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind(AUTH_TYPES.AUTH_CONTROLLER).to(AuthController).inSingletonScope();
	options.bind(AUTH_TYPES.AUTH_MIDDLEWARE).to(AuthMiddleware).inSingletonScope();
	options.bind(AUTH_TYPES.AUTH_GUARD).to(AuthGuard).inSingletonScope();
	options.bind(AUTH_TYPES.AUTH_SERVICE).to(AuthService).inSingletonScope();
	options.bind(AUTH_TYPES.TOKEN_SERVICE).to(TokenService).inSingletonScope();
	options.bind<IRefreshTokenCookieService>(AUTH_TYPES.REFRESH_TOKEN_COOKIE_SERVICE).to(RefreshTokenCookieService).inSingletonScope();
});

export { authModule, AUTH_TYPES, type ITokenPayload, AuthGuard };
