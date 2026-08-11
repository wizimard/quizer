import { BaseController } from '@shared/http/controller.base';
import { inject, injectable } from 'inversify';
import type { Request, Response, NextFunction } from 'express';
import { APP_TYPES } from '@app/app.types';
import type { User } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { IA_TYPES } from '..';
import type { UserService } from '../services/user.service';
import { AuthGuard } from '../middleware/auth.guard';
import type { ILogger } from '@shared/logger';
import { UserStorage } from '../storage/user.storage';

// TODO: add delete user
@injectable()
export class UserController extends BaseController {
	private readonly authGuard: AuthGuard = new AuthGuard();
	constructor(
		@inject(IA_TYPES.USER_SERVICE) private readonly userService: UserService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {
		super();

		this.useRoutes([
			{
				url: '/me',
				method: 'get',
				handler: this.getCurrentUser,
				middlewares: [this.authGuard],
			},
			{
				url: '/',
				method: 'delete',
				handler: this.deleteUser,
				middlewares: [this.authGuard],
			},
		]);
	}

	async getCurrentUser(_req: Request, res: Response, _next: NextFunction): Promise<void> {
		const user: User = await this.userService.getUserById(UserStorage.get()!.id);
		this.ok(res, UserMapper.toHttp(user));
	}

	async deleteUser(_req: Request, res: Response, _next: NextFunction): Promise<void> {
		await this.userService.deleteUser(UserStorage.get()!.id);

		this.noContent(res);
	}
}
