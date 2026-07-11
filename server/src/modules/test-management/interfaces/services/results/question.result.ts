import type { QuestionConfigBase, QuestionId, TestId } from '@modules/test-management';

export interface QuestionResult {
	id: QuestionId;
	testId: TestId;
	sortKey: number;
	description: string;
	config: QuestionConfigBase;
}
