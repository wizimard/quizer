import { inject, injectable } from 'inversify';
import { TM_TYPES } from '../test-management.types';
import { SchedulerPeriodMapper } from '../mappers/scheduler-period.mapper';
import { SchedulerPeriodPersistenceMapper } from '../mappers/repositories/scheduler-period-persistence.mapper';
import { SchedulerPeriodResultMapper } from '../mappers/result/scheduler-period-result.mapper';
import type { TestSchedulerPeriodModel } from '@prisma/client';
import type { UpdateTestSchedulerInput } from '../interfaces/services/input/update-test-scheduler.input';
import type { TestSchedulerService } from '../interfaces/services/test-scheduler.service.interface';
import type { TestSchedulerResultPeriod } from '../interfaces/services/results/test-scheduler.result';
import { SchedulerEditPeriodsValidationFailedError } from '../utils/errors/scheduler-edit-periods-validation-failed.error';
import type { TestSchedulerPeriod } from '../entities/test-scheduler-period';
import { SchedulerPeriodNotFoundError } from '../utils/errors/scheduler-period-not-found.error';
import type { ILogger } from '@shared/logger';
import { APP_TYPES } from '@app/app.types';
import type { TestSchedulerRepository } from '../interfaces/repository/test-scheduler.repository.interface';
import type { TestEntity } from '../entities/test.entity';

@injectable()
export class DefaultTestSchedulerService implements TestSchedulerService {
	constructor(
		@inject(TM_TYPES.TEST_SCHEDULER_REPOSITORY) private readonly testSchedulerRepository: TestSchedulerRepository,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async updateSchedulerPeriods(input: UpdateTestSchedulerInput): Promise<Array<TestSchedulerResultPeriod>> {
		this.logger.info({ message: '[TestSchedulerService updateSchedulerPeriods] start', data: input });

		const schedulerPeriods: Array<TestSchedulerPeriod> = (await this.testSchedulerRepository.getScheduler(input.test.id)).map(
			SchedulerPeriodMapper.toDomain,
		);

		const checkDate = new Date();
		checkDate.setTime(checkDate.getTime() + 5 * 60 * 1000);

		for (const period of input.schedulerPeriods.update ?? []) {
			const currentPeriod = schedulerPeriods.find((p) => p.id === period.id);

			if (!currentPeriod) {
				throw new SchedulerPeriodNotFoundError('TestSchedulerService.updateSchedulerPeriods');
			}

			if (currentPeriod.availableFrom <= checkDate) {
				throw new SchedulerEditPeriodsValidationFailedError('errors.scheduler_update_periods_time');
			}
		}

		for (const deletePeriodId of input.schedulerPeriods.remove ?? []) {
			const currentPeriod = schedulerPeriods.find((p) => p.id === deletePeriodId);

			if (!currentPeriod) {
				throw new SchedulerPeriodNotFoundError('TestSchedulerService.updateSchedulerPeriods');
			}

			if (currentPeriod.availableFrom <= checkDate) {
				throw new SchedulerEditPeriodsValidationFailedError('errors.scheduler_update_periods_time');
			}
		}

		const test: TestEntity = input.test;

		const updatedSchedulerPeriods: Array<TestSchedulerPeriodModel> = await this.testSchedulerRepository.updateSchedulerPeriods(
			test.id,
			SchedulerPeriodPersistenceMapper.toRepositoryUpdateData(test.id, input),
		);

		this.logger.info({
			message: '[TestSchedulerService updateSchedulerPeriods] scheduler periods updated',
			data: updatedSchedulerPeriods,
		});

		return updatedSchedulerPeriods.map(SchedulerPeriodMapper.toDomain).map(SchedulerPeriodResultMapper.toResult);
	}
}
