import { APP_TYPES } from '@app/app.types';
import type { IMiddleware } from '@shared/http/middleware.interface';
import { inject, injectable } from 'inversify';
import type { ILogger } from '@shared/logger';
import type { Request, Response, NextFunction } from 'express';
import { redactSensitive } from './utils/redact-sensitive';
import { UserStorage } from '@modules/identity-access';
import { RequestMetadataStorage } from './request-metadata.storage';

// TODO: review
@injectable()
export class RequestLoggerMiddleware implements IMiddleware {
	constructor(@inject(APP_TYPES.LOGGER) private readonly logger: ILogger) {}

	execute(req: Request, _res: Response, next: NextFunction): void {
		const safeBody = req.body ? redactSensitive(req.body) : undefined;

		this.logger.info({
			message: 'Request received',
			correlationId: RequestMetadataStorage.get()?.correlationId,
			method: req.method,
			url: req.url,
			userId: UserStorage.get()?.id,
			body: safeBody,
		});

		next();
	}
}
