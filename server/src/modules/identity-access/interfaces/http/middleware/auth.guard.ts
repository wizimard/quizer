import type { IMiddleware } from '@shared/http/middleware.interface';
import type { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';
import { HttpError } from '@shared/error';

@injectable()
export class AuthGuard implements IMiddleware {
	execute(req: Request, _res: Response, next: NextFunction): void {
		if (!req.user) {
			return next(new HttpError(401, 'unauthorized', 'AuthGuard'));
		}
		next();
	}
}
