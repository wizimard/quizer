import type { QuestionConfigBase } from './question-config.base';
import type { IQuestionConfigBase } from './question-config.interface';
import { createQuestionConfigFromPayload } from './question-config.registry';

export interface IQuestionConfigFactory {
	getConfig(config: IQuestionConfigBase): QuestionConfigBase;
}

export class QuestionConfigFactory implements IQuestionConfigFactory {
	getConfig(config: IQuestionConfigBase): QuestionConfigBase {
		return createQuestionConfigFromPayload(config as unknown as { type: string } & Record<string, unknown>);
	}
}
