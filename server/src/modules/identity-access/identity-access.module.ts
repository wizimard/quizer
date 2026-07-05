import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import { IA_TYPES } from './identity-access.types';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import type { UserRepository } from './interfaces/user.repository.interface';
import { HashService } from './services/hash.service';
import type { IHashService } from './interfaces/hash.service.interface';
import { TokenService } from './services/token.service';
import type { ITokenService } from './interfaces/token.service.interface';
import { AuthService } from './services/auth.service';
import { RefreshTokenCookieService } from './services/refresh-token-cookie.service';
import type { IRefreshTokenCookieService } from './interfaces/refresh-token-cookie.service.interface';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthGuard } from './middleware/auth.guard';
import { UserService } from './services/user.service';

const identityAccessModule: ContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind<IHashService>(APP_TYPES.HASH_SERVICE).to(HashService).inSingletonScope();
	options.bind<UserRepository>(IA_TYPES.USER_REPOSITORY).to(PrismaUserRepository).inSingletonScope();
	options.bind<ITokenService>(IA_TYPES.TOKEN_SERVICE).to(TokenService).inSingletonScope();
	options.bind(IA_TYPES.AUTH_SERVICE).to(AuthService).inSingletonScope();
	options.bind<IRefreshTokenCookieService>(IA_TYPES.REFRESH_TOKEN_COOKIE_SERVICE).to(RefreshTokenCookieService).inSingletonScope();
	options.bind(IA_TYPES.AUTH_CONTROLLER).to(AuthController).inSingletonScope();
	options.bind(IA_TYPES.USER_CONTROLLER).to(UserController).inSingletonScope();
	options.bind(IA_TYPES.USER_SERVICE).to(UserService).inSingletonScope();
	options.bind(IA_TYPES.AUTH_MIDDLEWARE).to(AuthMiddleware).inSingletonScope();
	options.bind(IA_TYPES.AUTH_GUARD).to(AuthGuard).inSingletonScope();
});

export { identityAccessModule, IA_TYPES };
