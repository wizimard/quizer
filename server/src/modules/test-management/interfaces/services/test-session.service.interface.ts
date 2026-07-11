import type { FinishTestInput } from './input/finish-test.input';
import type { StartTestInput } from './input/start-test.input';

export interface ITestSessionService {
	startTest(input: StartTestInput): Promise<boolean>;
	finishTest(input: FinishTestInput): Promise<boolean>;
}
