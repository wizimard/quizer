import type { IQuestionValidationError } from '../errors/question-validation.error';
import type { QuestionConfigBase } from './question-configs/question-config.base';
import { QUESTION_TYPES_CLASSES_MAP } from './question-configs/question-config.map';
import { type IQuestionEntity } from './question.entity.interface';

export class QuestionEntity implements IQuestionEntity {
	get type(): string {
		return this._config.type;
	}

	get config(): QuestionConfigBase {
		return this._config;
	}

	constructor(
		public readonly id: string,
		public readonly quizId: string,
		public description: string,
		public order: number,
		private _config: QuestionConfigBase,
	) {}

	changeConfig(config: QuestionConfigBase): this {
		this._config = config;
		return this;
	}

	validate(): IQuestionValidationError {
		const errorData: IQuestionValidationError = { id: this.id, errors: [] };

		if (!QUESTION_TYPES_CLASSES_MAP[this.type] || !(this._config instanceof QUESTION_TYPES_CLASSES_MAP[this.type])) {
			errorData.errors.push({
				path: 'type',
				message: 'wrong_type',
			});
		}

		errorData.errors.push(...this.config.validate());

		return errorData;
	}
}
