export class QuestionNotFoundError extends Error {
	constructor() {
		super('question_not_found');
		this.name = 'QuestionNotFoundError';
	}
}
