import type { ClassConstructor } from 'class-transformer';
import type { IMiddleware } from './middleware.interface';

export interface IMiddlewareFactory {
	authGuard(): IMiddleware;
	quizMiddleware(): IMiddleware;
	quizOwnershipGuard(): IMiddleware;
	validate(dtoClass: ClassConstructor<object>): IMiddleware;
}
