import { inject, injectable } from 'inversify';
import type { IExceptionFilter } from './exception.filter.interface';
import type { Request, Response, NextFunction } from 'express';
import { SHARED_TYPES } from '@shared/di/types';
import type { ILogger } from '@shared/logger';
import { HttpError } from './http.error';
import { InvalidCredentialsError, EmailAlreadyTakenError } from '@modules/identity-access';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(SHARED_TYPES.LOGGER) private readonly logger: ILogger) {}

	catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HttpError) {
			this.logger.error(`[${err.context}] ${err.statusCode} ${err.message}`);
			res.status(err.statusCode).send(err.getDataForSend()).end();
			return;
		}

		if (err instanceof InvalidCredentialsError) {
			this.logger.error(`[InvalidCredentialsError] 422 wrong email or password`);
			res.status(422).send({ message: 'wrong email or password' }).end();
			return;
		}

		if (err instanceof EmailAlreadyTakenError) {
			this.logger.error(`[EmailAlreadyTakenError] 422 email is busy`);
			res.status(422).send({ message: 'email is busy' }).end();
			return;
		}

		this.logger.error(err.stack ?? err.message);
		res.status(500).send({ message: 'internal_server_error' }).end();
	}
}
