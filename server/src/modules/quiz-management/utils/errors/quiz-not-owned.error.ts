import { HttpError } from '@shared/error';

export class QuizNotOwnedError extends HttpError {
	constructor(context: string) {
		super(403, 'error.quiz_not_author', context);
	}
}
