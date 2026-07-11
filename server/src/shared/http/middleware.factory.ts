import type { ClassConstructor } from 'class-transformer';
import { inject, injectable } from 'inversify';
import { IA_TYPES } from '@modules/identity-access/identity-access.types';
import { TM_TYPES } from '@modules/test-management/test-management.types';
import type { IMiddleware } from './middleware.interface';
import type { IMiddlewareFactory } from './middleware.factory.interface';
import { ValidateMiddleware } from './validate.middleware';

// TODO: review
@injectable()
export class MiddlewareFactory implements IMiddlewareFactory {
	constructor(
		@inject(IA_TYPES.AUTH_GUARD) private readonly authGuardMiddleware: IMiddleware,
		@inject(TM_TYPES.TEST_MIDDLEWARE) private readonly testMiddlewareMiddleware: IMiddleware,
		@inject(TM_TYPES.TEST_OWNERSHIP_GUARD) private readonly testOwnershipGuardMiddleware: IMiddleware,
	) {}

	authGuard(): IMiddleware {
		return this.authGuardMiddleware;
	}

	testMiddleware(): IMiddleware {
		return this.testMiddlewareMiddleware;
	}

	testOwnershipGuard(): IMiddleware {
		return this.testOwnershipGuardMiddleware;
	}

	validate(dtoClass: ClassConstructor<object>): IMiddleware {
		return new ValidateMiddleware(dtoClass);
	}
}
