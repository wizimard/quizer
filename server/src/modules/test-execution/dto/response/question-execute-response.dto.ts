import type { QuestionResponse } from '@modules/test-management/dto/http/response/question.response-dto';

export type QuestionExecuteConfigResponse = Omit<QuestionResponse['config'], 'answer'>;

export interface QuestionExecuteResponse extends Omit<QuestionResponse, 'config'> {
	config: QuestionExecuteConfigResponse;
}
