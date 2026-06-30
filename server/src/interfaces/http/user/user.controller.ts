import { BaseController } from '@common/controller.base';
import { inject, injectable } from 'inversify';
import type { Request, Response, NextFunction } from 'express';
import { APP_TYPES } from '@app_types';
import type { IMiddlewareFactory } from '@common/middleware.factory.interface';

@injectable()
export class UserController extends BaseController {
	constructor(@inject(APP_TYPES.MIDDLEWARE_FACTORY) private readonly middlewareFactory: IMiddlewareFactory) {
		super();

		this.useRoutes([
			{
				url: '/me',
				method: 'get',
				handler: this.getCurrentUser,
				middlewares: [this.middlewareFactory.authGuard()],
			},
		]);
	}

	getCurrentUser(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, { email: req.user?.email });
	}
}
