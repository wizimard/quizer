import type { Answer } from '@modules/test-execution/entities/answer';

export interface AnswerRepository {
	createAnswer(answer: Answer, userId: string): Promise<Answer | null>;
}
