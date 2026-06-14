import type { IQuestionValidationError } from '../errors/question-validation.error';
import type { IQuizValidationError } from '../errors/quiz-validation.errror';
import type { IQuestionEntity } from './question.entity.interface';
import type { IQuizEntity } from './quiz.entity.interface';

export class QuizEntity implements IQuizEntity {
	constructor(
		public readonly id: string,
		public title: string,
		public readonly authorId: string,
		public questions: IQuestionEntity[],
		public readonly updatedAt: Date,
		public readonly createdAt: Date,
	) {}

	validate(): IQuizValidationError {
		const validationData: IQuizValidationError = { id: this.id, errors: [], questionsErrors: [] };
		if (!this.title) {
			validationData.errors.push({
				path: 'title',
				message: 'empty_title',
			});
		}

		this.questions.forEach((question) => {
			const questionValidationData: IQuestionValidationError = question.validate();

			if (questionValidationData.errors.length) {
				validationData.questionsErrors.push(questionValidationData);
			}
		});

		return validationData;
	}
}
