import type { IQuestionValidationError } from './errors/question-validation.error';
import type { IQuizValidationError } from './errors/quiz-validation.errror';
import { QuizNotOwnedError } from './errors/quiz-not-owned.error';
import type { IQuestionEntity } from './question.entity.interface';
import type { IQuizSettings } from './quiz-settings.interface';
import type { IQuizEntity } from './quiz.entity.interface';

export class QuizEntity implements IQuizEntity {
	constructor(
		public readonly id: string,
		public title: string,
		public readonly authorId: string,
		public questions: Array<IQuestionEntity>,
		public readonly settings: IQuizSettings | null,
		public readonly updatedAt: Date,
		public readonly createdAt: Date,
	) {}

	assertOwnedBy(userId: string): void {
		if (this.authorId !== userId) {
			throw new QuizNotOwnedError();
		}
	}

	updateTitle(title: string): void {
		this.title = title;
	}

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

	validateUpdate(deleteIds: string[], addQuestions: IQuestionEntity[], updateQuestions: IQuestionEntity[]): IQuizValidationError {
		const validationData = this.validate();

		if (deleteIds.length && [...addQuestions, ...updateQuestions].some((question) => deleteIds.includes(question.id))) {
			validationData.errors.push({
				path: 'delete',
				message: 'include_in_questions',
			});
		}

		return validationData;
	}

	isOpen(): boolean {
		return (
			this.settings?.availablePeriods.some((period) => {
				const now = new Date();
				return now >= period.available_from && (!period.available_to || now <= period.available_to);
			}) || false
		);
	}
}
