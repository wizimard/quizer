import type { UserId } from '@modules/identity-access/domain/value-objects/user-id.vo';
import type { IQuestionValidationError } from '../errors/question-validation.error';
import { QuizNotOwnedError } from '../errors/quiz-not-owned.error';
import type { IQuizValidationError } from '../errors/quiz-validation.error';
import type { QuizId } from '../value-objects/quiz-id.vo';
import type { QuestionEntity } from './question.entity';
import type { IQuizSettings } from './quiz-settings.interface';

export class QuizEntity {
	constructor(
		public readonly id: QuizId,
		public title: string,
		public readonly authorId: UserId,
		public questions: Array<QuestionEntity>,
		public readonly settings: IQuizSettings | null,
		public readonly updatedAt: Date,
		public readonly createdAt: Date,
	) {}

	assertOwnedBy(userId: UserId): void {
		if (!this.authorId.equals(userId)) {
			throw new QuizNotOwnedError();
		}
	}

	updateTitle(title: string): void {
		this.title = title;
	}

	validate(): IQuizValidationError {
		const validationData: IQuizValidationError = { id: this.id.value, errors: [], questionsErrors: [] };
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

	validateUpdate(deleteIds: string[], addQuestions: QuestionEntity[], updateQuestions: QuestionEntity[]): IQuizValidationError {
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
