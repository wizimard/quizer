import type { QuestionConfigBase } from '@modules/test-management/entities/question-configs/question-config.base';
import type { TestId } from '@modules/test-management/entities/value-object/test-id';

export interface QuestionReadModel {
	readonly id: string;
	readonly testId: TestId;
	readonly description: string;
	readonly config: QuestionConfigBase;
}
