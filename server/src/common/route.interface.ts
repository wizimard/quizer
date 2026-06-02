import type { Router } from 'express';
import type { IMiddleware } from './middleware.interface';
import type { IRequestHandler } from './request-handler.interface';

export interface IRoute {
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch'>;
	url: string;
	handler: IRequestHandler;
	middlewares?: IMiddleware[];
}
