export class QuizNotOwnedError extends Error {
	constructor() {
		super('quiz_not_author');
		this.name = 'QuizNotOwnedError';
	}
}
