import type { IQuizValidationError } from '../errors/quiz-validation.errror';
import type { IQuestionEntity } from './question.entity.interface';

export interface IQuizEntity {
	id: string;
	title: string;
	authorId: string;
	questions: IQuestionEntity[];

	updatedAt: Date;
	createdAt: Date;

	validate(): IQuizValidationError;
}
