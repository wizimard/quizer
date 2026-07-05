import { BaseController } from '@shared/http/controller.base';
import { inject, injectable } from 'inversify';
import type { Request, Response, NextFunction } from 'express';
import { APP_TYPES } from '@app/app.types';
import type { IMiddlewareFactory } from '@shared/http/middleware.factory.interface';
import type { User } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { IA_TYPES } from '..';
import type { UserService } from '../services/user.service';

@injectable()
export class UserController extends BaseController {
	constructor(
		@inject(APP_TYPES.MIDDLEWARE_FACTORY) private readonly middlewareFactory: IMiddlewareFactory,
		@inject(IA_TYPES.USER_SERVICE) private readonly userService: UserService,
	) {
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

	async getCurrentUser(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const user: User = await this.userService.getUserById(req.user!.id);
		this.ok(res, UserMapper.toHttp(user));
	}
}
