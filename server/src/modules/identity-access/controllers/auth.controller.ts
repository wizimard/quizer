import { BaseController } from '@shared/http/controller.base';
import { inject, injectable } from 'inversify';
import type { Request, Response, NextFunction } from 'express';
import type { IRoute } from '@shared/http/route.interface';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { APP_TYPES } from '@app/app.types';
import type { IMiddlewareFactory } from '@shared/http/middleware.factory.interface';
import { IA_TYPES } from '../identity-access.types';
import type { AuthService } from '../services/auth.service';
import type { AuthResultDto } from '../dto/auth-result.dto';
import type { IRefreshTokenCookieService } from '../interfaces/refresh-token-cookie.service.interface';
import type { ITokenPair } from '../interfaces/token.service.interface';
import { AuthResponseMapper } from '../mappers/auth-response.mapper';

@injectable()
export class AuthController extends BaseController {
	constructor(
		@inject(IA_TYPES.AUTH_SERVICE) private readonly authService: AuthService,
		@inject(IA_TYPES.REFRESH_TOKEN_COOKIE_SERVICE) private readonly refreshTokenCookieService: IRefreshTokenCookieService,
		@inject(APP_TYPES.MIDDLEWARE_FACTORY) private readonly middlewareFactory: IMiddlewareFactory,
	) {
		super();

		const routes: IRoute[] = [
			{
				url: '/login',
				method: 'post',
				handler: this.login,
				middlewares: [this.middlewareFactory.validate(UserLoginDto)],
			},
			{
				url: '/register',
				method: 'post',
				handler: this.register,
				middlewares: [this.middlewareFactory.validate(UserRegisterDto)],
			},
			{
				url: '/logout',
				method: 'post',
				handler: this.logout,
				middlewares: [this.middlewareFactory.authGuard()],
			},
			{
				url: '/refresh',
				method: 'post',
				handler: this.refresh,
				middlewares: [],
			},
		];

		this.useRoutes(routes);
	}

	private async login(req: Request<object, object, UserLoginDto>, res: Response, _next: NextFunction): Promise<void> {
		const result: AuthResultDto = await this.authService.login({
			email: req.body.email,
			password: req.body.password,
		});

		this.refreshTokenCookieService.set(res, result.refreshToken);

		this.ok(res, AuthResponseMapper.toLoginHttp(result));
	}

	private async register(req: Request<object, object, UserRegisterDto>, res: Response, _next: NextFunction): Promise<void> {
		const result: AuthResultDto = await this.authService.register({
			email: req.body.email,
			password: req.body.password,
		});

		this.refreshTokenCookieService.set(res, result.refreshToken);

		this.created(res, AuthResponseMapper.toRegisterHttp(result));
	}

	private async logout(_req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.refreshTokenCookieService.clear(res);

		this.ok(res);
	}

	private async refresh(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const { accessToken, refreshToken }: ITokenPair = await this.authService.refreshTokens(this.refreshTokenCookieService.getFromRequest(req)!);

		this.refreshTokenCookieService.set(res, refreshToken);

		this.ok(res, { accessToken });
	}
}
