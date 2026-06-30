import { inject, injectable } from 'inversify';
import type { IExceptionFilter } from './exception.filter.interface';
import type { Request, Response, NextFunction } from 'express';
import { SHARED_TYPES } from '@shared/di/types';
import type { ILogger } from '@shared/logger';
import { HttpError } from './http.error';
import { QuizNotOwnedError } from '@modules/quiz-management/domain/errors/quiz-not-owned.error';
import { QuizNotFoundError } from '@modules/quiz-management/domain/errors/quiz-not-found.error';
import { QuizValidationFailedError } from '@modules/quiz-management/domain/errors/quiz-validation-failed.error';
import { InvalidCredentialsError } from '@modules/identity-access/domain/errors/invalid-credentials.error';
import { EmailAlreadyTakenError } from '@modules/identity-access/domain/errors/email-already-taken.error';
import { QuestionNotFoundError } from '@modules/quiz-execution/domain/errors/question-not-found.error';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(SHARED_TYPES.LOGGER) private readonly logger: ILogger) {}

	catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HttpError) {
			this.logger.error(`[${err.context}] ${err.statusCode} ${err.message}`);
			res.status(err.statusCode).send(err.getDataForSend()).end();
			return;
		}

		if (err instanceof QuizNotOwnedError) {
			this.logger.error(`[QuizNotOwnedError] 403 ${err.message}`);
			res.status(403).send({ message: err.message }).end();
			return;
		}

		if (err instanceof QuizNotFoundError) {
			this.logger.error(`[QuizNotFoundError] 404 ${err.message}`);
			res.status(404).send({ message: err.message }).end();
			return;
		}

		if (err instanceof QuestionNotFoundError) {
			this.logger.error(`[QuestionNotFoundError] 404 ${err.message}`);
			res.status(404).send({ message: err.message }).end();
			return;
		}

		if (err instanceof QuizValidationFailedError) {
			this.logger.error(`[QuizValidationFailedError] 422 ${err.message}`);
			res.status(422).send({ message: err.message, errors: err.validationErrors }).end();
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
