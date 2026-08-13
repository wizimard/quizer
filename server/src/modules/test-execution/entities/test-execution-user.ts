import type { Answer } from './answer';

export class TestExecutionUser {
	public id: string;

	public firstName: string;
	public lastName: string;

	answers: Answer[];

	public startedFrom: Date;

	constructor(id: string, firstName: string, lastName: string, startedFrom: Date, answers: Answer[]) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.startedFrom = startedFrom;
		this.answers = answers;
	}
}
