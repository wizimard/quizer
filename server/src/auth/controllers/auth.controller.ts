import { BaseController } from '@common/controller.base';
import { inject, injectable } from 'inversify';
import type { Request, Response, NextFunction } from 'express';
import type { IRoute } from '@common/route.interface';
import { ValidateMiddleware } from '@common/validate.middleware';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import type { IAuthService } from '../services/auth.service.interface';
import { AUTH_TYPES } from '../auth.types';
import { AuthGuard } from '../guards/auth.guard';
import type { ITokenPair } from '../services/token.service.interface';

@injectable()
export class AuthController extends BaseController {
	private readonly refreshCookieName: string = 'refreshToken';
	private readonly refreshCookieMaxAge: number = 1000 * 60 * 60 * 24 * 30; // 30 days

	constructor(@inject(AUTH_TYPES.AUTH_SERVICE) private readonly authService: IAuthService) {
		super();

		const routes: IRoute[] = [
			{
				url: '/login',
				method: 'post',
				handler: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				url: '/register',
				method: 'post',
				handler: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				url: '/logout',
				method: 'get',
				handler: this.logout,
				middlewares: [new AuthGuard()],
			},
			{
				url: '/refresh',
				method: 'get',
				handler: this.refresh,
				middlewares: [new AuthGuard()],
			},
		];

		this.useRoutes(routes);
	}

	private async login(req: Request<object, object, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
		try {
			const { accessToken, refreshToken }: ITokenPair = await this.authService.login(req.body.email, req.body.password);

			this.setRefreshTokenCookie(res, refreshToken);

			this.ok(res, { accessToken });
		} catch (error: unknown) {
			next(error);
		}
	}
	private async register(req: Request<object, object, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
		console.log(req.body);
		try {
			const { accessToken, refreshToken }: ITokenPair = await this.authService.register(req.body.email, req.body.password);

			this.setRefreshTokenCookie(res, refreshToken);

			this.created(res, { accessToken });
		} catch (error: unknown) {
			console.log(error);
			next(error);
		}
	}

	private async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			res.clearCookie(this.refreshCookieName, {
				httpOnly: true,
			});

			this.ok(res);
		} catch (error: unknown) {
			next(error);
		}
	}

	private async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { accessToken, refreshToken }: ITokenPair = await this.authService.refreshTokens(req.user!.id, req.user!.email);

			this.setRefreshTokenCookie(res, refreshToken);

			this.ok(res, { accessToken });
		} catch (error: unknown) {
			next(error);
		}
	}

	private setRefreshTokenCookie(res: Response, refreshToken: string): void {
		res.cookie(this.refreshCookieName, refreshToken, {
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: this.refreshCookieMaxAge,
		});
	}
}
