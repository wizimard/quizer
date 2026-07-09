import type { TestEntity } from '../../entities/test.entity';
import type { QuestionEntity } from '../../entities/question.entity';
import type { ITestValidationError } from '../../interfaces/error/test-validation.error.interface';

export class TestValidator {
	static validate(test: TestEntity): ITestValidationError {
		const validationData: ITestValidationError = { id: test.id.value, errors: [], questionsErrors: [] };

		if (!test.title) {
			validationData.errors.push({
				path: 'title',
				message: 'empty_title',
			});
		}

		test.questions.forEach((question) => {
			const questionValidationData = question.validate();

			if (questionValidationData.errors.length) {
				validationData.questionsErrors.push(questionValidationData);
			}
		});

		return validationData;
	}

	static validateUpdate(test: TestEntity, deleteIds: string[], addQuestions: QuestionEntity[], updateQuestions: QuestionEntity[]): ITestValidationError {
		const validationData = TestValidator.validate(test);

		if (deleteIds.length && [...addQuestions, ...updateQuestions].some((question) => deleteIds.includes(question.id.value))) {
			validationData.errors.push({
				path: 'delete',
				message: 'include_in_questions',
			});
		}

		return validationData;
	}
}
