import { inject, injectable } from 'inversify';
import { APP_TYPES } from '@app/app.types';
import type { IPrismaService } from '@shared/persistence';
import type { ILogger } from '@shared/logger';
import { repositoryCall } from '@shared/http/utils/repository-call';
import type { User } from '../entities/user.entity';
import type { UserRepository } from '../interfaces/user.repository.interface';
import type { Email } from '../entities/email';
import type { UserId } from '../entities/user-id';
import { UserMapper } from '../mappers/user.mapper';

@injectable()
export class PrismaUserRepository implements UserRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async create(user: User): Promise<User> {
		const data = UserMapper.toCreateData(user);

		const model = await repositoryCall(
			() =>
				this.prismaService.client.userModel.create({
					data,
				}),
			'PrismaUserRepository.create',
			this.logger,
		);

		return UserMapper.toDomain(model);
	}

	async findByEmail(email: Email): Promise<User | null> {
		const model = await repositoryCall(
			() =>
				this.prismaService.client.userModel.findUnique({
					where: { email: email.value },
				}),
			'PrismaUserRepository.findByEmail',
			this.logger,
		);

		return model ? UserMapper.toDomain(model) : null;
	}

	async findById(id: UserId): Promise<User | null> {
		const model = await repositoryCall(
			() =>
				this.prismaService.client.userModel.findUnique({
					where: { id: id.value },
				}),
			'PrismaUserRepository.findById',
			this.logger,
		);

		return model ? UserMapper.toDomain(model) : null;
	}

	async existsByEmail(email: Email): Promise<boolean> {
		const model = await repositoryCall(
			() =>
				this.prismaService.client.userModel.findUnique({
					where: { email: email.value },
					select: { id: true },
				}),
			'PrismaUserRepository.existsByEmail',
			this.logger,
		);

		return model !== null;
	}

	async delete(id: UserId): Promise<boolean> {
		const row = await repositoryCall(() => this.prismaService.client.userModel.delete({ where: { id: id.value } }), 'PrismaUserRepository.delete', this.logger);

		return !!row;
	}
}
