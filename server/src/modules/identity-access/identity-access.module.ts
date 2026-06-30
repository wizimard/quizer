import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import { IA_TYPES } from './identity-access.types';
import { PrismaUserRepository } from './infrastructure/persistence/repositories/prisma-user.repository';
import type { UserRepository } from './domain/repositories/user.repository.port';
import { BcryptHashService } from './infrastructure/hash/bcrypt-hash.service';
import type { PasswordHasher } from './domain/entities/user.entity';
import { HashService } from './infrastructure/hash/hash.service';
import type { IHashService } from './infrastructure/hash/hash.service.interface';
import { TokenService } from './infrastructure/auth/token.service';
import type { ITokenService } from './infrastructure/auth/token.service.interface';
import { JwtTokenService } from './infrastructure/auth/jwt-token.service';
import { RefreshTokenCookieService } from './infrastructure/auth/refresh-token-cookie.service';
import type { IRefreshTokenCookieService } from './infrastructure/auth/refresh-token-cookie.service.interface';
import { LoginHandler } from './application/handlers/login.handler';
import { RegisterHandler } from './application/handlers/register.handler';
import { RefreshTokensHandler } from './application/handlers/refresh-tokens.handler';
import { AuthController } from './interfaces/http/controllers/auth.controller';
import { UserController } from './interfaces/http/controllers/user.controller';
import { AuthMiddleware } from './interfaces/http/middleware/auth.middleware';
import { AuthGuard } from './interfaces/http/middleware/auth.guard';

const identityAccessModule: ContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind<IHashService>(APP_TYPES.HASH_SERVICE).to(HashService).inSingletonScope();
	options.bind<UserRepository>(IA_TYPES.USER_REPOSITORY).to(PrismaUserRepository).inSingletonScope();
	options.bind<PasswordHasher>(IA_TYPES.PASSWORD_HASHER).to(BcryptHashService).inSingletonScope();
	options.bind<ITokenService>(IA_TYPES.TOKEN_SERVICE).to(TokenService).inSingletonScope();
	options.bind<JwtTokenService>(IA_TYPES.JWT_TOKEN_SERVICE).to(JwtTokenService).inSingletonScope();
	options.bind(IA_TYPES.LOGIN_HANDLER).to(LoginHandler).inSingletonScope();
	options.bind(IA_TYPES.REGISTER_HANDLER).to(RegisterHandler).inSingletonScope();
	options.bind(IA_TYPES.REFRESH_TOKENS_HANDLER).to(RefreshTokensHandler).inSingletonScope();
	options.bind<IRefreshTokenCookieService>(IA_TYPES.REFRESH_TOKEN_COOKIE_SERVICE).to(RefreshTokenCookieService).inSingletonScope();
	options.bind(IA_TYPES.AUTH_CONTROLLER).to(AuthController).inSingletonScope();
	options.bind(IA_TYPES.USER_CONTROLLER).to(UserController).inSingletonScope();
	options.bind(IA_TYPES.AUTH_MIDDLEWARE).to(AuthMiddleware).inSingletonScope();
	options.bind(IA_TYPES.AUTH_GUARD).to(AuthGuard).inSingletonScope();
});

export { identityAccessModule, IA_TYPES };
