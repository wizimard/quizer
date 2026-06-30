const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
	private constructor(public readonly value: string) {}

	static of(value: string): Email {
		const normalized = value.trim().toLowerCase();

		if (!EMAIL_PATTERN.test(normalized)) {
			throw new Error('invalid_email');
		}

		return new Email(normalized);
	}

	equals(other: Email): boolean {
		return this.value === other.value;
	}
}
