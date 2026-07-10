import type { IQuestion } from '../entities/question.interface';
import type { ITest } from '../entities/test.interface';
import type { CreateQuestionInput } from './input/create-question.input';
import type { DeleteQuestionInput } from './input/delete-question.input';
import type { ChangeQuestionOrderInput } from './input/update-question-order.input';
import type { UpdateQuestionInput } from './input/update-question.input';

export interface IQuestionService {
	create(input: CreateQuestionInput): Promise<IQuestion>;
	update(input: UpdateQuestionInput): Promise<IQuestion>;
	delete(input: DeleteQuestionInput): Promise<void>;
	changeOrder(input: ChangeQuestionOrderInput): Promise<ITest>;
}
