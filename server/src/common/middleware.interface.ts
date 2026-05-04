import type { IRequestHandler } from './request-handler.interface';

export interface IMiddleware {
	execute: IRequestHandler;
}
