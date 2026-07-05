export class EmailAlreadyTakenError extends Error {
	constructor() {
		super('email_already_taken');
		this.name = 'EmailAlreadyTakenError';
	}
}
