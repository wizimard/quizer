export class Answer {
	public id: string;
	public questionId: string;
	public answer: string;
	public skipped: boolean;

	constructor(id: string, questionId: string, answer: string, skipped: boolean) {
		this.id = id;
		this.questionId = questionId;
		this.answer = answer;
		this.skipped = skipped;
	}
}
