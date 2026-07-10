import type { CreateQuestionInput } from './create-question.input';

export interface UpdateQuestionInput extends Omit<CreateQuestionInput, 'sortKey'> {
	id: string;
}
