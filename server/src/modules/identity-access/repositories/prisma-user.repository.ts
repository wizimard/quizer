import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import type { IPrismaService } from '@shared/persistence';
import type { ILogger } from '@shared/logger';
import { repositoryCall } from '@shared/http/utils/repository-call';
import type { User } from '../entities/user.entity';
import type { UserRepository } from '../interfaces/user.repository.interface';
import type { Email } from '../entities/email';
import { UserMapper } from '../mappers/user.mapper';
import type { UserModel } from '@prisma/client';

@injectable()
export class PrismaUserRepository implements UserRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async create(user: User): Promise<User | null> {
		const data = UserMapper.toCreateData(user);

		const model: UserModel | null = await repositoryCall(
			() =>
				this.prismaService.client.userModel.create({
					data,
				}),
			'PrismaUserRepository.create',
			this.logger,
		);

		return model ? UserMapper.toDomain(model) : null;
	}

	async findByEmail(email: Email): Promise<User | null> {
		const model: UserModel | null = await repositoryCall(
			() =>
				this.prismaService.client.userModel.findUnique({
					where: { email: email.value },
				}),
			'PrismaUserRepository.findByEmail',
			this.logger,
		);

		return model ? UserMapper.toDomain(model) : null;
	}

	async findById(id: string): Promise<User | null> {
		const model: UserModel | null = await repositoryCall(
			() =>
				this.prismaService.client.userModel.findUnique({
					where: { id },
				}),
			'PrismaUserRepository.findById',
			this.logger,
		);

		return model ? UserMapper.toDomain(model) : null;
	}

	async existsByEmail(email: Email): Promise<boolean> {
		const model: { id: string } | null = await repositoryCall(
			() =>
				this.prismaService.client.userModel.findUnique({
					where: { email: email.value },
					select: { id: true },
				}),
			'PrismaUserRepository.existsByEmail',
			this.logger,
		);

		return !!model;
	}

	async delete(id: string): Promise<boolean> {
		const row: UserModel | null = await repositoryCall(() => this.prismaService.client.userModel.delete({ where: { id } }), 'PrismaUserRepository.delete', this.logger);

		return !!row;
	}
}
