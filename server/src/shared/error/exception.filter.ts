import { inject, injectable } from 'inversify';
import type { IExceptionFilter } from './exception.filter.interface';
import type { Request, Response, NextFunction } from 'express';
import type { ILogger } from '@shared/logger';
import { HttpError } from './http.error';
import { APP_TYPES } from '@app/app.types';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(APP_TYPES.LOGGER) private readonly logger: ILogger) {}

	catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HttpError) {
			this.logger.error(`[${err.context}] ${err.statusCode} ${err.message}`);
			res.status(err.statusCode).send(err.getDataForSend()).end();
			return;
		}

		this.logger.error(err.stack ?? err.message);

		res.status(500).send({ message: 'internal_server_error' }).end();
	}
}
