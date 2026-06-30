import type { CreateQuestionInput } from './create-quiz.command';

export interface UpdateQuizCommand {
	id: string;
	authorId: string;
	title?: string;
	add?: CreateQuestionInput[];
	update?: CreateQuestionInput[];
	delete?: string[];
}
