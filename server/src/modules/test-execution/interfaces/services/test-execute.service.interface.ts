import type { TestExecuteGetInput } from './input/test-execute-get.input';
import type { TestExecuteResult } from './result/test-execute.result';

export interface TestExecuteService {
	getTest(input: TestExecuteGetInput): Promise<TestExecuteResult>;
}
