import { BaseController } from '@common/controller.base';
import { injectable } from 'inversify';
import type { Request, Response, NextFunction } from 'express';
import { AuthGuard } from '@auth';

@injectable()
export class UserController extends BaseController {
	constructor() {
		super();

		this.useRoutes([
			{
				url: '/me',
				method: 'get',
				handler: this.getCurrentUser,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	getCurrentUser(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, req.user);
	}
}
