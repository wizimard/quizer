import type { CreateQuestionInput } from './input/create-question.input';
import type { DeleteQuestionInput } from './input/delete-question.input';
import type { ChangeQuestionOrderInput } from './input/update-question-order.input';
import type { UpdateQuestionInput } from './input/update-question.input';
import type { QuestionResult } from './results/question.result';

export interface IQuestionService {
	create(input: CreateQuestionInput): Promise<QuestionResult>;
	update(input: UpdateQuestionInput): Promise<QuestionResult>;
	delete(input: DeleteQuestionInput): Promise<void>;
	changeOrder(input: ChangeQuestionOrderInput): Promise<Array<QuestionResult>>;
}
