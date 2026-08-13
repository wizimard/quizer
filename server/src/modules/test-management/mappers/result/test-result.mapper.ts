import { TestEntity } from '../../entities/test.entity';
import type { TestFullResult, TestFullResultSettings } from '../../interfaces/services/results/test-full.result';
import type { TestResult } from '../../interfaces/services/results/test.result';
import { QuestionResultMapper } from '@modules/question-management/mappers/result/question-result.mapper';
import { SchedulerPeriodResultMapper } from './scheduler-period-result.mapper';

export class TestResultMapper {
	static toResult(test: TestEntity): TestResult {
		return {
			id: test.id,
			authorId: test.authorId,
			title: test.title,
			status: test.status,
			launchesCount: test.sessions.length,
			lastLaunchDate: test.sessions[0]?.startedAt ?? null,
			createdAt: test.createdAt,
			updatedAt: test.updatedAt,
		};
	}

	static toFullResult(test: TestEntity): TestFullResult {
		const settings: TestFullResultSettings = {
			isShowAnswersAfterCompletion: test.settings?.isShowAnswersAfterCompletion ?? false,
		};

		return {
			...this.toResult(test),
			questions: test.questions.map(QuestionResultMapper.toResult),
			settings,
			scheduler: {
				periods: test.schedulerPeriods.map(SchedulerPeriodResultMapper.toResult),
			},
			session: test.sessions[0] ?? null,
		};
	}
}
