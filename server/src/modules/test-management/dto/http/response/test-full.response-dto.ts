import type { TestStatus } from '@modules/test-management/entities/test.entity';
import type { QuestionResponse } from './question.response-dto';
import type { TestSchedulerResponse } from './test-scheduler.response-dto';
import type { TestResponse } from './test.response-dto';

export interface TestFullResponseSettings {
	is_required_email: boolean;
	is_required_first_name: boolean;
	is_required_last_name: boolean;
	is_show_answers_after_completion: boolean;
}

export interface TestFullResponse extends Omit<TestResponse, 'isOpen'> {
	status: TestStatus;
	questions: Array<QuestionResponse>;
	settings: TestFullResponseSettings;
	scheduler: TestSchedulerResponse;
}
