import type { TestSchedulerPeriodModel, TestModel, TestQuestionModel, TestSessionModel } from '@prisma/client';
import { TestSchedulerPeriod } from '../entities/test-scheduler-period';
import { TestEntity } from '../entities/test.entity';
import { TestSettings } from '../entities/test-settings';
import { TestSessionEntity } from '../entities/test-session.entity';
import type { TestModelAll } from '../interfaces/repository/test.repository.interface';
import { QuestionPersistenceMapper } from '@modules/question-management/mappers/repositories/question-persistence.mapper';
import type { CreateTestInput } from '../interfaces/services/input/create-test.input';
import { Helper } from '@shared/utils/helper';

export class TestMapper {
	static toDomain(testModel: TestModelAll | TestModel): TestEntity {
		const test: TestEntity = new TestEntity(testModel.id, testModel.author_id, testModel.title, testModel.updated_at, testModel.created_at);

		if ('questions' in testModel) {
			test.questions = testModel.questions.map((question: TestQuestionModel) => QuestionPersistenceMapper.toDomain(question));
		}

		if ('scheduler_periods' in testModel) {
			test.schedulerPeriods = testModel.scheduler_periods.map(
				(period: TestSchedulerPeriodModel) => new TestSchedulerPeriod(Number(period.id), test.id, period.available_from, period.available_to),
			);
		}

		if ('test_settings' in testModel && testModel.test_settings) {
			test.settings = new TestSettings(test.id, testModel.test_settings.show_answers_after_completion);
		}

		if ('test_sessions' in testModel) {
			test.setSessions(
				testModel.test_sessions.map(
					(session: TestSessionModel) =>
						new TestSessionEntity(session.id, test.id, session.status, session.run_mode, session.started_at, session.finished_at, session.start_by, session.current_question_id),
				),
			);
		}

		return test;
	}

	static buildTestFromCreateInput(input: CreateTestInput): TestEntity {
		return new TestEntity(Helper.generateId(), input.authorId, input.title, new Date(), new Date());
	}
}
