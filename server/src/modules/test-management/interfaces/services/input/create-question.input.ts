import type { IQuestionConfigBase } from '@modules/test-management/entities/question-configs/question-config.interface';

export interface CreateQuestionInput {
	testId: string;
	description: string;
	config: IQuestionConfigBase;
	sortKey: number;
}
