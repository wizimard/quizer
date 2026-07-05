import type { IQuestionConfigBase } from '../../entities/question-configs/question-config.interface';

export interface CreateQuestionInput {
	quizId: string;
	description: string;
	order: number;
	config: IQuestionConfigBase;
}

export interface UpdateQuestionInput extends CreateQuestionInput {
	id: string;
}

export interface DeleteQuestionInput {
	id: string;
	quizId: string;
}
