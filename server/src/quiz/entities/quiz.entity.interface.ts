import type { IQuizValidationError } from '../errors/quiz-validation.errror';
import type { IQuestionEntity } from './question.entity.interface';
import type { IQuizSettings } from './quiz-settings.interface';

export interface IQuizEntity {
	id: string;
	title: string;
	authorId: string;
	questions: Array<IQuestionEntity>;
	settings: IQuizSettings | null;

	updatedAt: Date;
	createdAt: Date;

	validate(): IQuizValidationError;

	isOpen(): boolean;
}
