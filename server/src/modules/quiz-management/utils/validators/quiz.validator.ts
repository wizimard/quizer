import type { QuizEntity } from '../../entities/quiz.entity';
import type { QuestionEntity } from '../../entities/question.entity';
import type { IQuizValidationError } from '../../interfaces/error/quiz-validation.error.interface';

export class QuizValidator {
	static validate(quiz: QuizEntity): IQuizValidationError {
		const validationData: IQuizValidationError = { id: quiz.id.value, errors: [], questionsErrors: [] };

		if (!quiz.title) {
			validationData.errors.push({
				path: 'title',
				message: 'empty_title',
			});
		}

		quiz.questions.forEach((question) => {
			const questionValidationData = question.validate();

			if (questionValidationData.errors.length) {
				validationData.questionsErrors.push(questionValidationData);
			}
		});

		return validationData;
	}

	static validateUpdate(quiz: QuizEntity, deleteIds: string[], addQuestions: QuestionEntity[], updateQuestions: QuestionEntity[]): IQuizValidationError {
		const validationData = QuizValidator.validate(quiz);

		if (deleteIds.length && [...addQuestions, ...updateQuestions].some((question) => deleteIds.includes(question.id.value))) {
			validationData.errors.push({
				path: 'delete',
				message: 'include_in_questions',
			});
		}

		return validationData;
	}
}
