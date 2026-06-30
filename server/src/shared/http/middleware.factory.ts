import type { ClassConstructor } from 'class-transformer';
import { inject, injectable } from 'inversify';
import { IA_TYPES } from '@modules/identity-access/identity-access.types';
import type { IMiddleware } from './middleware.interface';
import type { IMiddlewareFactory } from './middleware.factory.interface';
import { ValidateMiddleware } from './validate.middleware';

@injectable()
export class MiddlewareFactory implements IMiddlewareFactory {
	constructor(@inject(IA_TYPES.AUTH_GUARD) private readonly authGuardMiddleware: IMiddleware) {}

	authGuard(): IMiddleware {
		return this.authGuardMiddleware;
	}

	validate(dtoClass: ClassConstructor<object>): IMiddleware {
		return new ValidateMiddleware(dtoClass);
	}
}
