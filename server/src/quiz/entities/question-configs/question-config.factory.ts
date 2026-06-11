import type { QuestionConfigBase } from './question-config.base';
import type { IQuestionConfigBase } from './question-config.interface';
import { QUESTION_TYPES_CLASSES_MAP } from './question-config.map';

export interface IQuestionConfigFactory {
	getConfig(config: IQuestionConfigBase): QuestionConfigBase | never;
}

export class QuestionConfigFactory implements IQuestionConfigFactory {
	getConfig(config: IQuestionConfigBase): QuestionConfigBase | never {
		return new QUESTION_TYPES_CLASSES_MAP[config.type](config);
	}
}
