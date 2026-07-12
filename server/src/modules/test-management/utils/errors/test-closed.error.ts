import { HttpError } from '@shared/error';

export class TestClosedError extends HttpError {
	constructor(context: string, message: string = 'errors.test_closed') {
		super(400, message, context);
	}
}
