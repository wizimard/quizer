import { APP_TYPES } from '@app_types';
import type { IMiddleware } from '@common/middleware.interface';
import { inject, injectable } from 'inversify';
import type { ILogger } from '@logger';
import type { Request, Response, NextFunction } from 'express';

@injectable()
export class RequestLoggerMiddleware implements IMiddleware {
	constructor(@inject(APP_TYPES.LOGGER) private readonly logger: ILogger) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		this.logger.info(`[RequestLoggerMiddleware] ${req.url} ${req.method}`);

		if (req.user) {
			this.logger.info(JSON.stringify(req.user));
		}

		this.logger.info(JSON.stringify(req.body, undefined, 4));

		next();
	}
}
