import type { Request, Response } from 'express';

export interface IRefreshTokenCookieService {
	set(res: Response, refreshToken: string): void;
	clear(res: Response): void;
	getFromRequest(req: Request): string | undefined;
}
