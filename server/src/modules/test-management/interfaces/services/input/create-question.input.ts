import type { TestId } from '@modules/test-management';
import type { IQuestionConfigBase } from '@modules/test-management/entities/question-configs/question-config.interface';

export interface CreateQuestionInput {
	testId: TestId;
	description: string;
	config: IQuestionConfigBase;
	sortKey: number;
}
