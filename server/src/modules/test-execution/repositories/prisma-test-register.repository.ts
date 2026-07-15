import { inject, injectable } from 'inversify';
import type { TestRegisterRepository, TestRegisteredUserModel } from '../interfaces/repositories/test-register.repository.interface';
import { APP_TYPES } from '@app/app.types';
import type { IPrismaService } from '@shared/persistence';
import { repositoryCall } from '@shared/http/utils/repository-call';
import type { ILogger } from '@shared/logger';
import { PrismaTestRegisterMapper } from '../mappers/repositories/prisma-test-register.mapper';
import { TestExecutionUserMapper } from '../mappers/test-execution-user.mapper';
import type { TestExecutionUser } from '../entities/test-execution-user';

const REGISTER_USER_INCLUDE = {
	answers: true,
} as const;

@injectable()
export class PrismaTestRegisterRepository implements TestRegisterRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async registerUserForTest(sessionId: string, firstName: string, lastName: string): Promise<TestExecutionUser | null> {
		const row: TestRegisteredUserModel = await repositoryCall(
			() => {
				return this.prismaService.client.testSessionRegisteredUserModel.create({
					data: PrismaTestRegisterMapper.toRegisterUserPersistence(sessionId, firstName, lastName),
					include: REGISTER_USER_INCLUDE,
				});
			},
			'PrismaTestRegisterRepository.registerUserForTest',
			this.logger,
		);

		return row ? TestExecutionUserMapper.toDomain(row) : null;
	}

	async findRegisteredUser(sessionId: string, firstName: string, lastName: string): Promise<TestExecutionUser | null> {
		const row: TestRegisteredUserModel | null = await repositoryCall(
			() => {
				return this.prismaService.client.testSessionRegisteredUserModel.findFirst({
					where: PrismaTestRegisterMapper.toFindRegisteredUserPersistence(sessionId, firstName, lastName)!,
					include: REGISTER_USER_INCLUDE,
				});
			},
			'PrismaTestRegisterRepository.findRegisteredUser',
			this.logger,
		);

		return row ? TestExecutionUserMapper.toDomain(row) : null;
	}

	async findRegisteredUserById(userId: string): Promise<TestExecutionUser | null> {
		const row: TestRegisteredUserModel | null = await repositoryCall(
			() => {
				return this.prismaService.client.testSessionRegisteredUserModel.findUnique({
					where: { id: userId },
					include: REGISTER_USER_INCLUDE,
				});
			},
			'PrismaTestRegisterRepository.findRegisteredUserById',
			this.logger,
		);

		return row ? TestExecutionUserMapper.toDomain(row) : null;
	}
}
