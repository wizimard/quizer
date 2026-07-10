import type { QuestionEntity } from '@modules/test-management/entities/question.entity';

export interface QuestionRepository {
	create(data: QuestionEntity): Promise<QuestionEntity>;
	update(data: QuestionEntity): Promise<QuestionEntity>;
	delete(id: string, testId: string): Promise<boolean>;
	findById(id: string): Promise<QuestionEntity | null>;
	findByTestId(testId: string): Promise<QuestionEntity[]>;
	updateQuestionsOrders(questions: QuestionEntity[]): Promise<boolean>;
}
