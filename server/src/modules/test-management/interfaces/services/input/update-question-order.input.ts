export interface ChangeQuestionOrderInput {
	testId: string;
	questionId: string;
	previousQuestionId: string | null;
	nextQuestionId: string | null;
}
