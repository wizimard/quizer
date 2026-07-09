import { HttpError } from '@shared/error';

export class QuestionNotFoundError extends HttpError {
	constructor(context: string) {
		super(404, 'error.question_not_found', context);
	}
}
