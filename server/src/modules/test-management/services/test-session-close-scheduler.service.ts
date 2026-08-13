import { inject, injectable } from 'inversify';
import { schedule, type ScheduledTask } from 'node-cron';
import { APP_TYPES } from '@app/app.types';
import type { ILogger } from '@shared/logger';
import { TM_TYPES } from '../test-management.types';
import type { TestSessionRepository } from '../interfaces/repository/test-session.repository.interface';
import type { TestSessionCloseScheduler } from '../interfaces/services/test-session-close-scheduler.service.interface';

@injectable()
export class DefaultTestSessionCloseScheduler implements TestSessionCloseScheduler {
	private readonly tasks = new Map<string, ScheduledTask>();
	private fallbackTask: ScheduledTask | undefined;

	constructor(
		@inject(TM_TYPES.TEST_SESSION_REPOSITORY) private readonly testSessionRepository: TestSessionRepository,
		@inject(APP_TYPES.LOGGER) private readonly logger: ILogger,
	) {}

	async start(): Promise<void> {
		this.logger.info('[TestSessionCloseScheduler start] restoring scheduled test closes');

		const sessions = await this.testSessionRepository.findActiveWithDeadline();
		const now = Date.now();

		for (const session of sessions) {
			if (!session.finished_at) {
				continue;
			}

			if (session.finished_at.getTime() <= now) {
				await this.closeTest(session.test_id);
				continue;
			}

			this.schedule(session.test_id, session.finished_at);
		}

		this.fallbackTask = schedule('* * * * *', () => this.closeExpiredTests(), {
			name: 'close-expired-test-sessions',
			noOverlap: true,
		});
	}

	async stop(): Promise<void> {
		const tasks = [...this.tasks.values()];
		this.tasks.clear();

		if (this.fallbackTask) {
			tasks.push(this.fallbackTask);
			this.fallbackTask = undefined;
		}

		await Promise.all(tasks.map((task) => Promise.resolve(task.destroy())));

		this.logger.info('[TestSessionCloseScheduler stop] scheduled test closes stopped');
	}

	schedule(testId: string, closeAt: Date): void {
		this.cancel(testId);

		if (closeAt.getTime() <= Date.now()) {
			void this.closeTest(testId);
			return;
		}

		const expression = this.toCronExpression(closeAt);
		const task = schedule(expression, () => this.closeTest(testId), {
			name: `close-test-session-${testId}`,
			maxExecutions: 1,
			noOverlap: true,
		});

		task.on('execution:finished', () => {
			this.tasks.delete(testId);
		});

		task.on('execution:failed', (context) => {
			this.tasks.delete(testId);
			this.logger.error({
				message: '[TestSessionCloseScheduler] scheduled close failed',
				data: { testId, error: context.error?.message },
			});
		});

		this.tasks.set(testId, task);

		this.logger.info({
			message: '[TestSessionCloseScheduler] scheduled test close',
			data: { testId, closeAt, expression },
		});
	}

	cancel(testId: string): void {
		const task = this.tasks.get(testId);

		if (!task) {
			return;
		}

		void task.destroy();
		this.tasks.delete(testId);

		this.logger.info({
			message: '[TestSessionCloseScheduler] cancelled scheduled test close',
			data: { testId },
		});
	}

	private async closeExpiredTests(): Promise<void> {
		try {
			const sessions = await this.testSessionRepository.finishExpiredTests();

			for (const session of sessions) {
				this.cancel(session.test_id);
				this.logger.info({ message: '[TestSessionCloseScheduler] closed expired test', data: session });
			}
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			this.logger.error(`[TestSessionCloseScheduler closeExpiredTests] ${message}`);
		}
	}

	private async closeTest(testId: string): Promise<void> {
		this.logger.info({ message: '[TestSessionCloseScheduler closeTest] start', data: { testId } });

		try {
			const session = await this.testSessionRepository.finishTest(testId);

			if (!session) {
				this.logger.warn({
					message: '[TestSessionCloseScheduler closeTest] test was not closed',
					data: { testId },
				});
				return;
			}

			this.logger.info({ message: '[TestSessionCloseScheduler closeTest] test closed', data: session });
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			this.logger.error(`[TestSessionCloseScheduler closeTest] ${message}`);
		}
	}

	private toCronExpression(date: Date): string {
		return `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;
	}
}
