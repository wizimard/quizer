import { HttpError } from '@shared/error';

export class TestOpenError extends HttpError {
	constructor(context: string, message: string = 'errors.test_open') {
		super(400, message, context);
	}
}
