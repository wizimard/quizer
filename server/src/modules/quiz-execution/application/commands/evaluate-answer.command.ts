export interface EvaluateAnswerCommand {
	quizId: string;
	questionId: string;
	answer: unknown;
}
