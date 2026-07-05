import type { IQuestionValidationError } from '../interfaces/error/question-validation.error.interface';
import type { QuestionConfigBase } from './question-configs/question-config.base';
import { isQuestionType } from './question-configs/question-config.registry';
import type { QuestionId } from './value-object/question-id';
import type { QuizId } from './value-object/quiz-id';

export class QuestionEntity {
	get type(): string {
		return this._config.type;
	}

	get config(): QuestionConfigBase {
		return this._config;
	}

	constructor(
		public readonly id: QuestionId,
		public readonly quizId: QuizId,
		public description: string,
		public order: number,
		private _config: QuestionConfigBase,
	) {}

	changeConfig(config: QuestionConfigBase): this {
		this._config = config;
		return this;
	}

	validate(): IQuestionValidationError {
		const errorData: IQuestionValidationError = { id: this.id.value, errors: [] };

		if (!isQuestionType(this._config.type)) {
			errorData.errors.push({
				path: 'type',
				message: 'wrong_type',
			});
			return errorData;
		}

		errorData.errors.push(...this.config.validate());

		return errorData;
	}
}
