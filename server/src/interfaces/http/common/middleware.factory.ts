import type { ClassConstructor } from 'class-transformer';
import { inject, injectable } from 'inversify';
import { AUTH_TYPES } from '@composition/auth.types';
import type { IMiddleware } from './middleware.interface';
import type { IMiddlewareFactory } from './middleware.factory.interface';
import { ValidateMiddleware } from './validate.middleware';

@injectable()
export class MiddlewareFactory implements IMiddlewareFactory {
	constructor(@inject(AUTH_TYPES.AUTH_GUARD) private readonly authGuardMiddleware: IMiddleware) {}

	authGuard(): IMiddleware {
		return this.authGuardMiddleware;
	}

	validate(dtoClass: ClassConstructor<object>): IMiddleware {
		return new ValidateMiddleware(dtoClass);
	}
}
