import { HttpValidationError } from '@shared/error';
import type { ITestValidationError } from '../../interfaces/error/test-validation.error.interface';

export class TestValidationFailedError extends HttpValidationError {
	constructor(
		public readonly validationErrors: ITestValidationError,
		context: string,
	) {
		super('error.test_validation_failed', context, validationErrors);
	}
}
