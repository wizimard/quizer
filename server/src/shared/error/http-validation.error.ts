import { HttpError } from './http.error';

export class HttpValidationError extends HttpError {
	public readonly validationErrors: object;

	constructor(message: string, context: string, validationErrors: object) {
		super(422, message, context);

		this.validationErrors = validationErrors;
	}

	public override getDataForSend(): object {
		return {
			message: this.message,
			errors: this.validationErrors,
		};
	}
}
