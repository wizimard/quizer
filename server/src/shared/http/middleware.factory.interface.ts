import type { ClassConstructor } from 'class-transformer';
import type { IMiddleware } from './middleware.interface';

export interface IMiddlewareFactory {
	authGuard(): IMiddleware;
	testMiddleware(): IMiddleware;
	testOwnershipGuard(): IMiddleware;
	validate(dtoClass: ClassConstructor<object>): IMiddleware;
}
