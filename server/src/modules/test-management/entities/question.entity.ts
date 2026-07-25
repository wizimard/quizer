import type { IQuestionValidationError } from '../interfaces/error/question-validation.error.interface';
import type { QuestionConfigBase } from './question-configs/question-config.base';
import { isQuestionType } from './question-configs/question-config.registry';

export class QuestionEntity {
	public readonly id: string;
	public readonly testId: string;
	public description: string;
	public sortKey: number;
	private _config: QuestionConfigBase;

	constructor(id: string, testId: string, description: string, sortKey: number, config: QuestionConfigBase) {
		this.id = id;
		this.testId = testId;
		this.description = description;
		this.sortKey = sortKey;
		this._config = config;
	}

	get type(): string {
		return this._config.type;
	}

	get config(): QuestionConfigBase {
		return this._config;
	}

	public changeConfig(config: QuestionConfigBase): this {
		this._config = config;
		return this;
	}

	public validate(): IQuestionValidationError {
		const errorData: IQuestionValidationError = { id: this.id, errors: [] };

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

	public isValidAnswer(answer: string): boolean {
		return this._config.isValidAnswer(answer);
	}

	public isCorrectAnswer(answer: string): boolean {
		return this._config.isCorrectAnswer(answer);
	}
}
