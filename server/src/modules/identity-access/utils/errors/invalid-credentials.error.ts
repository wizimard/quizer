import { HttpError } from '@shared/error';

export class InvalidCredentialsError extends HttpError {
	constructor() {
		super(422, 'invalid_credentials', 'InvalidCredentialsError');
	}
}
