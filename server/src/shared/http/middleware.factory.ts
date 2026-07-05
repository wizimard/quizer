import type { ClassConstructor } from 'class-transformer';
import { inject, injectable } from 'inversify';
import { IA_TYPES } from '@modules/identity-access/identity-access.types';
import { QM_TYPES } from '@modules/quiz-management/quiz-management.types';
import type { IMiddleware } from './middleware.interface';
import type { IMiddlewareFactory } from './middleware.factory.interface';
import { ValidateMiddleware } from './validate.middleware';

@injectable()
export class MiddlewareFactory implements IMiddlewareFactory {
	constructor(
		@inject(IA_TYPES.AUTH_GUARD) private readonly authGuardMiddleware: IMiddleware,
		@inject(QM_TYPES.QUIZ_MIDDLEWARE) private readonly quizMiddlewareMiddleware: IMiddleware,
		@inject(QM_TYPES.QUIZ_OWNERSHIP_GUARD) private readonly quizOwnershipGuardMiddleware: IMiddleware,
	) {}

	authGuard(): IMiddleware {
		return this.authGuardMiddleware;
	}

	quizMiddleware(): IMiddleware {
		return this.quizMiddlewareMiddleware;
	}

	quizOwnershipGuard(): IMiddleware {
		return this.quizOwnershipGuardMiddleware;
	}

	validate(dtoClass: ClassConstructor<object>): IMiddleware {
		return new ValidateMiddleware(dtoClass);
	}
}
