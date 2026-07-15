import type { QuestionId } from '@modules/test-management';
import type { AnswerId } from './value-object/answer-id';

export class Answer {
	public id: AnswerId;
	public questionId: QuestionId;
	public answer: string;
	public skipped: boolean;

	constructor(id: AnswerId, questionId: QuestionId, answer: string, skipped: boolean) {
		this.id = id;
		this.questionId = questionId;
		this.answer = answer;
		this.skipped = skipped;
	}
}
