const MIN_LENGTH = 8;
const MAX_LENGTH = 255;

export class Password {
	private constructor(public readonly value: string) {}

	static of(value: string): Password {
		const trimmed = value.trim();

		if (trimmed.length < MIN_LENGTH || trimmed.length > MAX_LENGTH) {
			throw new Error('invalid_password');
		}

		return new Password(trimmed);
	}
}
