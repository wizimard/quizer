import { createQuestionConfigFromPayload } from '@modules/test-management/entities/question-configs/question-config.registry';
import { QuestionEntity } from '@modules/test-management/entities/question.entity';
import { Helper } from '@shared/utils/helper';
import type { CreateQuestionInput } from '../interfaces/services/input/create-question.input';
import type { UpdateQuestionInput } from '../interfaces/services/input/update-question.input';

export class QuestionWriteMapper {
	static fromCreateInput(input: CreateQuestionInput, sortKey: number): QuestionEntity {
		return new QuestionEntity(
			Helper.generateId(),
			input.testId,
			input.description,
			sortKey,
			createQuestionConfigFromPayload(input.config as unknown as { type: string } & Record<string, unknown>),
		);
	}

	static fromUpdateInput(input: UpdateQuestionInput): QuestionEntity {
		return new QuestionEntity(input.id, input.testId, input.description, 0, createQuestionConfigFromPayload(input.config as unknown as { type: string } & Record<string, unknown>));
	}
}
