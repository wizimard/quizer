import type { TestSchedulerPeriodModel, TestModel, TestQuestionModel, TestSessionModel } from '@prisma/client';
import { UserId } from '@modules/identity-access';
import { TestSchedulerPeriod } from '../entities/test-scheduler-period';
import { TestEntity } from '../entities/test.entity';
import { TestSettings } from '../entities/test-settings';
import { TestId } from '../entities/value-object/test-id';
import { TestSessionEntity } from '../entities/test-session.entity';
import type { TTestModelAll } from '../interfaces/repository/test.repository.interface';
import type { QuestionEntity } from '../entities/question.entity';
import { QuestionMapper } from './question.mapper';

export const TestMapper = {
	toDomain(testModel: TTestModelAll | TestModel): TestEntity {
		const testId = TestId.of(testModel.id);

		let questions: Array<QuestionEntity> = [];

		if ('questions' in testModel) {
			questions = testModel.questions.map((question: TestQuestionModel) => QuestionMapper.toDomain(question));
		}

		const sessions =
			'test_sessions' in testModel
				? testModel.test_sessions.map((session: TestSessionModel) => new TestSessionEntity(session.id, testId, session.started_at, session.finished_at, session.status, session.start_by))
				: [];

		const schedulerPeriods =
			'scheduler_periods' in testModel
				? testModel.scheduler_periods.map((period: TestSchedulerPeriodModel) => new TestSchedulerPeriod(Number(period.id), testId, period.available_from, period.available_to))
				: [];

		if (!('test_settings' in testModel) || !testModel.test_settings) {
			return new TestEntity(testId, UserId.of(testModel.author_id), testModel.title, questions, null, schedulerPeriods, sessions, testModel.updated_at, testModel.created_at);
		}

		const settings = new TestSettings(
			testId,
			testModel.test_settings.required_email,
			testModel.test_settings.required_first_name,
			testModel.test_settings.required_last_name,
			testModel.test_settings.show_answers_after_completion,
		);

		return new TestEntity(testId, UserId.of(testModel.author_id), testModel.title, questions, settings, schedulerPeriods, sessions, testModel.updated_at, testModel.created_at);
	},
};
