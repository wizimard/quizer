import { HttpError } from '@shared/error';

export class EmailAlreadyTakenError extends HttpError {
	constructor() {
		super(422, 'email_already_taken', 'EmailAlreadyTakenError');
	}
}
