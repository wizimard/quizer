import { HttpError } from '@shared/error';

export class TestNotOwnedError extends HttpError {
	constructor(context: string) {
		super(403, 'error.test_not_author', context);
	}
}
