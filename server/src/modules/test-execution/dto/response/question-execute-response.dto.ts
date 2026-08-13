import type { IQuestionConfigMultipleChoise, IQuestionInputValueConfig, IQuestionSingleChoiseConfig, QuestionType } from '@modules/test-management';

export interface QuestionExecuteResponseInputConfig extends Omit<IQuestionInputValueConfig, 'answer' | 'ignore_case'> {
	type: Extract<QuestionType, 'input'>;
}

export interface QuestionExecuteResponseSingleChoiceConfig extends Omit<IQuestionSingleChoiseConfig, 'answer'> {
	type: Extract<QuestionType, 'single_choice'>;
}

export interface QuestionExecuteResponseMultipleChoiceConfig extends Omit<IQuestionConfigMultipleChoise, 'answer'> {
	type: Extract<QuestionType, 'multiple_choice'>;
}

export type QuestionExecuteResponseConfig = QuestionExecuteResponseInputConfig | QuestionExecuteResponseSingleChoiceConfig | QuestionExecuteResponseMultipleChoiceConfig;

export interface QuestionExecuteResponse {
	id: string;
	test_id: string;
	sort_key: number;
	description: string;
	image: string | null;
	config: QuestionExecuteResponseConfig;
}
