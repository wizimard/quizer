import type { TestEntity } from '../entities/test.entity';
import type { TestDto } from '../dto/entities/test.entity.dto';
import type { TestSettingsDto } from '../dto/entities/test-settings.entity.dto';
import type { ITestSchedulerPeriod } from '../interfaces/test-scheduler-period.interface';
import type { QuestionEntity } from '../entities/question.entity';

const emptySettings = (): TestSettingsDto => ({
	isRequiredEmail: false,
	isRequiredFirstName: false,
	isRequiredLastName: false,
	isShowAnswersAfterCompletion: false,
});

export function toTestDto(test: TestEntity): TestDto {
	const settings: TestSettingsDto = test.settings
		? {
				isRequiredEmail: test.settings.isRequiredEmail,
				isRequiredFirstName: test.settings.isRequiredFirstName,
				isRequiredLastName: test.settings.isRequiredLastName,
				isShowAnswersAfterCompletion: test.settings.isShowAnswersAfterCompletion,
			}
		: emptySettings();

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
			config: question.config.toObject(),
		})),
		settings,
		schedulerPeriods: test.schedulerPeriods.map((period: ITestSchedulerPeriod) => ({
			id: period.id,
			testId: period.testId,
			availableFrom: period.available_from,
			availableTo: period.available_to,
		})),
		updatedAt: test.updatedAt,
		createdAt: test.createdAt,
	};
}
