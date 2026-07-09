import type { QuestionEntity } from '../../entities/question.entity';
import type { QuestionId } from '../../entities/value-object/question-id';
import type { TestId } from '../../entities/value-object/test-id';

export interface QuestionRepository {
	create(data: QuestionEntity): Promise<QuestionEntity>;
	update(data: QuestionEntity): Promise<QuestionEntity>;
	delete(id: QuestionId, testId: TestId): Promise<boolean>;
	findById(id: QuestionId): Promise<QuestionEntity | null>;
	findByTestId(testId: TestId): Promise<QuestionEntity[]>;
	updateQuestionsOrders(questions: QuestionEntity[]): Promise<boolean>;
}
