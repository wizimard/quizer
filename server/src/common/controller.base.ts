import { Router, type Response } from 'express';
import type { IController } from './controller.interface';
import type { IRoute } from './route.interface';
import type { IRequestHandler } from './request-handler.interface';

export abstract class BaseController implements IController {
	private _router: Router;

	get router(): Router {
		return this._router;
	}

	constructor() {
		this._router = Router();
	}

	protected useRoutes(routes: IRoute[]): void {
		for (const route of routes) {
			const middlewares: IRequestHandler[] = [];

			if (route.middlewares) {
				for (const middleware of route.middlewares) {
					middlewares.push(middleware.execute.bind(middleware));
				}
			}

			this._router[route.method](route.url, ...middlewares, route.handler.bind(this));
		}
	}

	protected send(res: Response, status: number, data: unknown = null): void {
		res.status(status).send(data).end();
	}

	protected ok(res: Response, data: unknown = null): void {
		this.send(res, 200, data);
	}

	protected created(res: Response, data: unknown = null): void {
		this.send(res, 201, data);
	}
}
