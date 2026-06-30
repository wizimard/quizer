import type { IValidationError } from '../../errors/validation.error';
import type { IQuestionConfigOption } from './question-config-option';

export interface QuestionOptionsValidationRules {
	minLength?: number;
	maxLength?: number;
	lengthMessage: string;
	wrongFormatMessage?: string;
}

export function validateQuestionOptions(options: IQuestionConfigOption[] | unknown, rules: QuestionOptionsValidationRules): IValidationError[] {
	const errors: IValidationError[] = [];
	const basePath = 'config.options';

	if (!Array.isArray(options)) {
		errors.push({
			path: basePath,
			message: rules.wrongFormatMessage ?? 'options_wrong_format',
		});
		return errors;
	}

	const { minLength, maxLength } = rules;
	const lengthInvalid = (minLength !== undefined && options.length < minLength) || (maxLength !== undefined && options.length > maxLength);

	if (lengthInvalid) {
		errors.push({
			path: basePath,
			message: rules.lengthMessage,
		});
	}

	for (let i = 0; i < options.length; i++) {
		options[i]?.validate().forEach((error: IValidationError) => {
			errors.push({
				path: `config.options.${i}.${error.path}`,
				message: error.message,
			});
		});
	}

	return errors;
}
