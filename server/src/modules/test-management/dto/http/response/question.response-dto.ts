import type { IQuestionInputValueConfig } from '@modules/test-management/entities/question-configs/question-config-input-value';
import type { IQuestionConfigMultipleChoise } from '@modules/test-management/entities/question-configs/question-config-multiple-choise';
import type { IQuestionSingleChoiseConfig } from '@modules/test-management/entities/question-configs/question-config-single-choise';
import type { QuestionType } from '@modules/test-management/entities/question-configs/question-type';

export interface QuestionResponseInputConfig extends IQuestionInputValueConfig {
	type: Extract<QuestionType, 'input'>;
}

export interface QuestionResponseSingleChoiceConfig extends IQuestionSingleChoiseConfig {
	type: Extract<QuestionType, 'single_choice'>;
}

export interface QuestionResponseMultipleChoiceConfig extends IQuestionConfigMultipleChoise {
	type: Extract<QuestionType, 'multiple_choice'>;
}

export type QuestionResponseConfig = QuestionResponseInputConfig | QuestionResponseSingleChoiceConfig | QuestionResponseMultipleChoiceConfig;

export interface QuestionResponse {
	id: string;
	test_id: string;
	sort_key: number;
	description: string;
	config: QuestionResponseConfig;
}
