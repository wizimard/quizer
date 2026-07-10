import type { TestEntity } from '../entities/test.entity';
import type { ITest } from '../interfaces/entities/test.interface';
import type { ITestSettings } from '../interfaces/entities/test-settings.interface';
import type { ITestSchedulerPeriod } from '../interfaces/entities/test-scheduler-period.interface';
import type { QuestionEntity } from '../entities/question.entity';
import { QuestionConfigMapper } from './question-config.mapper';

const emptySettings = (): ITestSettings => ({
	isRequiredEmail: false,
	isRequiredFirstName: false,
	isRequiredLastName: false,
	isShowAnswersAfterCompletion: false,
});

export function toTest(test: TestEntity): ITest {
	const settings: ITestSettings = test.settings ?? emptySettings();

	return {
		id: test.id.value,
		authorId: test.authorId.value,
		title: test.title,
		status: test.status,
		questions: test.questions.map((question: QuestionEntity) => ({
			id: question.id.value,
			testId: question.testId.value,
			sortKey: question.sortKey,
			description: question.description,
			config: QuestionConfigMapper.toPlain(question.config),
		})),
		settings,
		schedulerPeriods: test.schedulerPeriods.map((period: ITestSchedulerPeriod) => ({
			id: period.id,
			testId: period.testId,
			availableFrom: period.availableFrom,
			availableTo: period.availableTo,
		})),
		updatedAt: test.updatedAt,
		createdAt: test.createdAt,
	};
}
