import type { IQuestionConfigBase } from '../../entities/question-configs/question-config.interface';
import type { TestEntity } from '../../entities/test.entity';

export interface CreateQuestionInput {
	testId: string;
	description: string;
	config: IQuestionConfigBase;
	sortKey: number;
}

export interface UpdateQuestionInput extends Omit<CreateQuestionInput, 'sortKey'> {
	id: string;
}

export interface DeleteQuestionInput {
	id: string;
	testId: string;
}

export interface ChangeQuestionOrderInput {
	test: TestEntity;
	questionId: string;
	previousQuestionId: string | null;
	nextQuestionId: string | null;
}
