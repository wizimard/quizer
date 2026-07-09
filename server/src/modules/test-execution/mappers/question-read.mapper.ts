import { createQuestionConfigFromPayload } from '@modules/test-management/entities/question-configs/question-config.registry';
import { TestId } from '@modules/test-management/entities/value-object/test-id';
import type { QuestionReadModel } from '../entities/question-read.model';
import type { TestQuestionModel } from '@prisma/client';

export class QuestionReadMapper {
	static toReadModel(row: TestQuestionModel): QuestionReadModel {
		const config = createQuestionConfigFromPayload(row.config as { type: string } & Record<string, unknown>);

		return {
			id: row.id,
			testId: TestId.of(row.test_id),
			description: row.description,
			config,
		};
	}
}
