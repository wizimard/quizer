import { HttpError } from '@shared/error';

export class TestNotFoundError extends HttpError {
	constructor(context: string) {
		super(404, 'error.test_not_found', context);
	}
}
