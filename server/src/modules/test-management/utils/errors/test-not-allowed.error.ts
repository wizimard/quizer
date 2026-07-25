import { HttpError } from '@shared/error';

export class TestNotAllowedError extends HttpError {
	constructor(context: string, message: string) {
		super(403, context, message);
	}
}
