import type { TestId } from '@modules/test-management/entities/value-object/test-id';
import type { QuestionReadModel } from '../entities/question-read.model';
// TODO: review
export interface QuestionReadRepository {
	findById(testId: TestId, questionId: string): Promise<QuestionReadModel | null>;
}
