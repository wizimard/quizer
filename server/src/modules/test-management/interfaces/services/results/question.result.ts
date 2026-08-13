import type { QuestionConfigBase } from '@modules/test-management';

// TODO: review
export interface QuestionResult {
	id: string;
	testId: string;
	sortKey: number;
	description: string;
	score: number;
	image: string | null;
	config: QuestionConfigBase;
}
