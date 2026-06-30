import type { IAnswerEvaluationResponse } from '@interfaces/http/quiz/types/answer-evaluation-response.interface';

export interface IAnswerEvaluationService {
	evaluateAnswer(quizId: string, questionId: string, submittedAnswer: unknown): Promise<IAnswerEvaluationResponse>;
}
