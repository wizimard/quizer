import type { QuestionConfigBase } from './question-configs/question-config.base';
import type { IQuestionValidationError } from './errors/question-validation.error';

export interface IQuestionEntity {
	id: string;
	quizId: string;
	description: string;
	order: number;
	config: QuestionConfigBase;

	validate(): IQuestionValidationError;
}
