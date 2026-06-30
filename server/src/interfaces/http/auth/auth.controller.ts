import { BaseController } from '@common/controller.base';
import { inject, injectable } from 'inversify';
import type { Request, Response, NextFunction } from 'express';
import type { IRoute } from '@common/route.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import type { IAuthRequestResponse, IAuthService } from '@application/auth/auth.service.interface';
import { AUTH_TYPES } from '@composition/auth.types';
import type { ITokenPair } from '@infrastructure/auth/jwt/token.service.interface';
import type { IRefreshTokenCookieService } from '@infrastructure/auth/refresh-token-cookie.service.interface';
import { APP_TYPES } from '@app_types';
import type { IMiddlewareFactory } from '@common/middleware.factory.interface';

@injectable()
export class AuthController extends BaseController {
	constructor(
		@inject(AUTH_TYPES.AUTH_SERVICE) private readonly authService: IAuthService,
		@inject(AUTH_TYPES.REFRESH_TOKEN_COOKIE_SERVICE) private readonly refreshTokenCookieService: IRefreshTokenCookieService,
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
		const { accessToken, refreshToken, user }: IAuthRequestResponse = await this.authService.login(req.body.email, req.body.password);

		this.refreshTokenCookieService.set(res, refreshToken);

		this.ok(res, { accessToken, user: { email: user.email } });
	}

	private async register(req: Request<object, object, UserRegisterDto>, res: Response, _next: NextFunction): Promise<void> {
		const { accessToken, refreshToken, user }: IAuthRequestResponse = await this.authService.register(req.body.email, req.body.password);

		this.refreshTokenCookieService.set(res, refreshToken);

		this.created(res, { accessToken, user: { email: user.email } });
	}

	private async logout(req: Request, res: Response, _next: NextFunction): Promise<void> {
		this.refreshTokenCookieService.clear(res);

		this.ok(res);
	}

	private async refresh(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const { accessToken, refreshToken }: ITokenPair = await this.authService.refreshTokens(this.refreshTokenCookieService.getFromRequest(req)!);

		this.refreshTokenCookieService.set(res, refreshToken);

		this.ok(res, { accessToken });
	}
}
