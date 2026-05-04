import type { IMiddleware } from '@common/middleware.interface';
import type { Request, Response, NextFunction } from 'express';

export class AuthGuard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): unknown {
		if (!req.user) {
			return res.status(401).end();
		}
		next();
	}
}
