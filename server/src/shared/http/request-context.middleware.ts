import type { IMiddleware } from '@shared/http/middleware.interface';
import { injectable } from 'inversify';
import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { APP_TYPES } from '@app/app.types';
import type { ILogger } from '@shared/logger';
import { inject } from 'inversify';

@injectable()
export class RequestContextMiddleware implements IMiddleware {
	constructor(@inject(APP_TYPES.LOGGER) private readonly logger: ILogger) {}

	execute(req: Request, _res: Response, next: NextFunction): void {
		req.correlationId = randomUUID();
		this.logger.setCorrelationId(req.correlationId);
		next();
	}
}
