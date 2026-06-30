import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app_types';
import type { IPrismaService } from '@database';
import type { IUserRepository } from './user.repository.interface';
import type { UserModel } from '@prisma/client';
import type { ILogger } from '@logger';
import type { IUser } from '@domain/user/user.entity.interface';
import { repositoryCall } from '@common/utils/repository-call';

@injectable()
export class UserRepository implements IUserRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private logger: ILogger,
	) {}

	public async create(user: IUser): Promise<UserModel | null> {
		return repositoryCall(
			() =>
				this.prismaService.client.userModel.create({
					data: {
						email: user.email,
						password: user.password,
					},
				}),
			'UserRepository.create',
			this.logger,
		);
	}

	public async getByEmail(email: string): Promise<UserModel | null> {
		return repositoryCall(
			() =>
				this.prismaService.client.userModel.findUnique({
					where: {
						email,
					},
				}),
			'UserRepository.getByEmail',
			this.logger,
		);
	}

	public async getById(id: string): Promise<UserModel | null> {
		return repositoryCall(
			() =>
				this.prismaService.client.userModel.findUnique({
					where: {
						id,
					},
				}),
			'UserRepository.getById',
			this.logger,
		);
	}
}
