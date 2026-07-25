import type { NextFunction, Request, Response, Router } from 'express';
import type { IMiddleware } from './middleware.interface';

export interface IRoute {
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch'>;
	url: string;
	handler: (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
	middlewares?: IMiddleware[];
}
