import type { IQuestionConfigBase } from '../../domain/value-objects/question-configs/question-config.interface';

export interface CreateQuestionInput {
	id: string;
	description: string;
	order: number;
	config: IQuestionConfigBase;
}

export interface CreateQuizCommand {
	title: string;
	questions: CreateQuestionInput[];
	authorId: string;
}
