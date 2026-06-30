import type { IMiddleware } from '@shared/http/middleware.interface';
import { injectable } from 'inversify';
import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';

@injectable()
export class RequestContextMiddleware implements IMiddleware {
	execute(req: Request, _res: Response, next: NextFunction): void {
		req.correlationId = randomUUID();
		next();
	}
}
