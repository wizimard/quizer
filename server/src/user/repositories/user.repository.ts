import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app_types';
import type { IPrismaService } from '@database';
import type { IUserRepository } from './user.repository.interface';
import type { UserModel } from '@prisma/client';
import type { ILogger } from '@logger';
import type { IUser } from '../entities/user.entity.interface';

@injectable()
export class UserRepository implements IUserRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private logger: ILogger,
	) {}

	public async create(user: IUser): Promise<UserModel | null> {
		try {
			const newUser: UserModel = await this.prismaService.client.userModel.create({
				data: {
					email: user.email,
					password: user.password,
				},
			});

			return newUser;
		} catch (err: unknown) {
			if (err instanceof Error) {
				this.logger.error('[UserRepository] error while creting user: ' + err.message);
			}
			return null;
		}
	}

	public async getByEmail(email: string): Promise<UserModel | null> {
		try {
			return await this.prismaService.client.userModel.findUnique({
				where: {
					email,
				},
			});
		} catch {
			return null;
		}
	}

	public async getById(id: string): Promise<UserModel | null> {
		try {
			return await this.prismaService.client.userModel.findUnique({
				where: {
					id,
				},
			});
		} catch {
			return null;
		}
	}
}
