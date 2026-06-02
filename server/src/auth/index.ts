import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { AUTH_TYPES } from './auth.types';
import { AuthController } from './controllers/auth.controller';
import { TokenService } from './services/token.service';
import { AuthService } from './services/auth.service';
import type { ITokenPayload } from './services/token.service.interface';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { AuthGuard } from './guards/auth.guard';

const authModule: ContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind(AUTH_TYPES.AUTH_CONTROLLER).to(AuthController).inSingletonScope();
	options.bind(AUTH_TYPES.AUTH_MIDDLEWARE).to(AuthMiddleware).inSingletonScope();
	options.bind(AUTH_TYPES.AUTH_SERVICE).to(AuthService).inSingletonScope();
	options.bind(AUTH_TYPES.TOKEN_SERVICE).to(TokenService).inSingletonScope();
});

export { authModule, AUTH_TYPES, type ITokenPayload, AuthGuard };
