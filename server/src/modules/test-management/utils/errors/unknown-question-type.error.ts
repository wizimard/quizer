import { HttpError } from '@shared/error';

export class UnknownQuestionTypeError extends HttpError {
	constructor(context: string) {
		super(400, 'error.unknown_question_type', context);
	}
}
