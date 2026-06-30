import type { IQuestionResponse } from './question-response.interface';
import type { IQuizSettingsBase } from '@modules/quiz-management/domain/entities/quiz-settings.interface';

export interface IQuizResponse {
	id: string;
	authorId: string;
	title: string;
	questions: Array<IQuestionResponse>;
	settings: IQuizSettingsBase;
	updatedAt: Date;
	createdAt: Date;
}
