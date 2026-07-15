import { APP_TYPES } from '@app/app.types';
import type { IMiddleware } from '@shared/http/middleware.interface';
import { inject, injectable } from 'inversify';
import type { ILogger } from '@shared/logger';
import type { Request, Response, NextFunction } from 'express';
import { redactSensitive } from './utils/redact-sensitive';

@injectable()
export class RequestLoggerMiddleware implements IMiddleware {
	constructor(@inject(APP_TYPES.LOGGER) private readonly logger: ILogger) {}

	execute(req: Request, _res: Response, next: NextFunction): void {
		const safeBody = req.body ? redactSensitive(req.body) : undefined;

		this.logger.info({
			message: 'Request received',
			correlationId: req.correlationId,
			method: req.method,
			url: req.url,
			userId: req.user?.id,
			body: safeBody,
		});

		next();
	}
}
