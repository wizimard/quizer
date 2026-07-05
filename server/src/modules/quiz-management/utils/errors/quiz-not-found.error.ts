import { HttpError } from '@shared/error';

export class QuizNotFoundError extends HttpError {
	constructor(context: string) {
		super(404, 'error.quiz_not_found', context);
	}
}
