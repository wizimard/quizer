import type { IMiddleware } from '@shared/http/middleware.interface';
import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '@shared/error';
import { UserStorage } from '../storage/user.storage';

export class AuthGuard implements IMiddleware {
	execute(_req: Request, _res: Response, next: NextFunction): void {
		if (!UserStorage.get()) {
			return next(new HttpError(401, 'unauthorized', 'AuthGuard'));
		}
		next();
	}
}
