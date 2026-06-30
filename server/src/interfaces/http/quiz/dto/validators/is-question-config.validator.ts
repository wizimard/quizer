import { ValidatorConstraint, type ValidatorConstraintInterface } from 'class-validator';
import { isQuestionType } from '@domain/quiz/question-configs/question-config.registry';

@ValidatorConstraint({ name: 'isQuestionConfig', async: false })
export class IsQuestionConfigConstraint implements ValidatorConstraintInterface {
	validate(config: unknown): boolean {
		if (!config || typeof config !== 'object' || Array.isArray(config)) {
			return false;
		}

		if (!('type' in config)) {
			return false;
		}

		return typeof config.type === 'string' && isQuestionType(config.type);
	}

	defaultMessage(): string {
		return 'invalid question config';
	}
}
