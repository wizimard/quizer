import { QuestionId } from '@modules/test-management';
import { Answer } from '../entities/answer';
import { AnswerId } from '../entities/value-object/answer-id';
import type { TestSessionAnswerModel } from '@prisma/client';
import type { TestSessionAnswerModelCreateArgs } from '@prisma/models';

export class AnswerMapper {
	static toDomain(model: TestSessionAnswerModel): Answer {
		return new Answer(AnswerId.of(model.id), QuestionId.of(model.questionId), model.value ?? '', model.skipped);
	}

	static toPersistenceCreate(answer: Answer, userId: string): TestSessionAnswerModelCreateArgs['data'] {
		return {
			id: answer.id.value,
			questionId: answer.questionId.value,
			value: answer.skipped ? null : answer.answer,
			skipped: answer.skipped,
			test_session_registered_user_id: userId,
			created_at: new Date(),
		};
	}
}
