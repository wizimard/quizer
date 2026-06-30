export class QuizNotFoundError extends Error {
	constructor() {
		super('quiz_not_found');
		this.name = 'QuizNotFoundError';
	}
}
