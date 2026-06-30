import { APP_TYPES } from '@app_types';
import type { IMiddleware } from '@common/middleware.interface';
import { inject, injectable } from 'inversify';
import type { ILogger } from '@logger';
import type { Request, Response, NextFunction } from 'express';
import { redactSensitive } from './utils/redact-sensitive';

@injectable()
export class RequestLoggerMiddleware implements IMiddleware {
	constructor(@inject(APP_TYPES.LOGGER) private readonly logger: ILogger) {}

	execute(req: Request, _res: Response, next: NextFunction): void {
		const safeBody = req.body ? redactSensitive(req.body) : undefined;

		this.logger.info(
			JSON.stringify({
				correlationId: req.correlationId,
				method: req.method,
				url: req.url,
				userId: req.user?.id,
				body: safeBody,
			}),
		);

		next();
	}
}
