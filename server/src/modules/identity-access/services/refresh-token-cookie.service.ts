import { injectable } from 'inversify';
import type { Request, Response } from 'express';
import type { IRefreshTokenCookieService } from '../interfaces/refresh-token-cookie.service.interface';

@injectable()
export class RefreshTokenCookieService implements IRefreshTokenCookieService {
	private readonly cookieName: string = 'refreshToken';
	private readonly maxAge: number = 1000 * 60 * 60 * 24 * 30;
	private readonly secure: boolean = process.env.NODE_ENV === 'production';

	set(res: Response, refreshToken: string): void {
		res.cookie(this.cookieName, refreshToken, {
			httpOnly: true,
			sameSite: 'strict',
			secure: this.secure,
			maxAge: this.maxAge,
		});
	}

	clear(res: Response): void {
		res.clearCookie(this.cookieName, {
			httpOnly: true,
			sameSite: 'strict',
			secure: this.secure,
		});
	}

	getFromRequest(req: Request): string | undefined {
		return req.cookies[this.cookieName];
	}
}
