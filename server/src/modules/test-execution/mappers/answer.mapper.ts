import { Answer } from '../entities/answer';
import type { TestSessionAnswerModel } from '@prisma/client';
import type { TestSessionAnswerModelCreateArgs } from '@prisma/models';

export class AnswerMapper {
	static toDomain(model: TestSessionAnswerModel): Answer {
		return new Answer(model.id, model.questionId, model.value ?? '', model.skipped);
	}

	static toPersistenceCreate(answer: Answer, userId: string): TestSessionAnswerModelCreateArgs['data'] {
		return {
			id: answer.id,
			questionId: answer.questionId,
			value: answer.skipped ? null : answer.answer,
			skipped: answer.skipped,
			test_session_registered_user_id: userId,
			created_at: new Date(),
		};
	}
}
