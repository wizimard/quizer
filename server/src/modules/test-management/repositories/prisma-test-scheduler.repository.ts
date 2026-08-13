import { inject, injectable } from 'inversify';
import type { TestUpdateSchedulerPeriodsData, TestSchedulerRepository } from '../interfaces/repository/test-scheduler.repository.interface';
import type { IPrismaService } from '@shared/persistence';
import { APP_TYPES } from '@app/app.types';
import type { ILogger } from '@shared/logger';
import type { TestSchedulerPeriodModel } from '@prisma/client';
import type { PrismaPromise } from '@prisma/client/runtime/client';
import { repositoryCall } from '@shared/http/utils/repository-call';
import { TestPersistenceMapper } from '../mappers/repositories/test-persistence.mapper';

@injectable()
export class PrismaTestSchedulerRepository implements TestSchedulerRepository {
	constructor(
		@inject(APP_TYPES.PRISMA) private readonly prismaService: IPrismaService,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async getScheduler(testId: string): Promise<Array<TestSchedulerPeriodModel>> {
		const rows: Array<TestSchedulerPeriodModel> | null = await repositoryCall(
			() =>
				this.prismaService.client.testSchedulerPeriodModel.findMany({
					where: { test_id: testId },
				}),
			'PrismaTestSchedulerRepository getScheduler',
			this.logger,
		);

		return rows ? rows : [];
	}

	async updateSchedulerPeriods(testId: string, data: TestUpdateSchedulerPeriodsData): Promise<Array<TestSchedulerPeriodModel>> {
		const rows: unknown[] | null = await repositoryCall<unknown[]>(
			() => {
				const { createData, updateData, deleteData } = TestPersistenceMapper.toSchedulerPeriodsUpdateInput(testId, data);

				const transactions: Array<PrismaPromise<unknown>> = [];

				if (createData.length) {
					transactions.push(
						this.prismaService.client.testSchedulerPeriodModel.createMany({
							data: createData,
						}),
					);
				}

				if (updateData.length) {
					updateData.forEach((update) => {
						transactions.push(this.prismaService.client.testSchedulerPeriodModel.update(update));
					});
				}

				if (deleteData.id) {
					transactions.push(
						this.prismaService.client.testSchedulerPeriodModel.deleteMany({
							where: deleteData,
						}),
					);
				}

				transactions.push(
					this.prismaService.client.testSchedulerPeriodModel.findMany({
						where: { test_id: testId },
					}),
				);

				return this.prismaService.client.$transaction(transactions);
			},
			'PrismaTestSchedulerRepository updateSchedulerPeriods',
			this.logger,
		);

		return rows ? (rows.at(-1) as unknown as Array<TestSchedulerPeriodModel>) : [];
	}
}
