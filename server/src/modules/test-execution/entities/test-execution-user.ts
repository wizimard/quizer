import type { Answer } from './answer';
import type { TestExecutionUserId } from './value-object/test-execution-user-id';

export class TestExecutionUser {
	public id: TestExecutionUserId;

	public firstName: string;
	public lastName: string;

	answers: Answer[];

	constructor(id: TestExecutionUserId, firstName: string, lastName: string, answers: Answer[]) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.answers = answers;
	}
}
