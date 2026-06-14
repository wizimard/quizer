import { inject, injectable } from 'inversify';
import type { IExceptionFilter } from './exception.filter.interface';
import type { Request, Response, NextFunction } from 'express';
import { APP_TYPES } from '@app_types';
import type { ILogger } from '@logger';
import { HttpError } from './http.error';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(APP_TYPES.LOGGER) private readonly logger: ILogger) {}

	catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HttpError) {
			this.logger.error(`[${err.context}] ${err.statusCode} ${err.message}`);
			res.status(err.statusCode).send(err.getDataForSend()).end();
		} else {
			this.logger.error(err.message);
			res.status(500).send({ err: err.message }).end();
		}
	}
}
