import { useCallback } from "react";
import { useTestExecutionStore, type TestExecutionUser } from "../model/test-execution.store";
import type { QuestionExecution } from "@entities/question/model/question-execution.interface";

export const useSetExecutionState = () => {
	return useCallback((testId: string, user: TestExecutionUser, currentQuestion: QuestionExecution | null, currentQuestionIndex: number, totalQuestions: number) => {
		useTestExecutionStore.getState().setTestId(testId);
		useTestExecutionStore.getState().setUser(user);

		useTestExecutionStore.getState().setCurrentQuestion(currentQuestion);
		useTestExecutionStore.getState().setCurrentQuestionIndex(currentQuestionIndex);
		useTestExecutionStore.getState().setTotalQuestionsCount(totalQuestions);

		useTestExecutionStore.getState().setStatus(currentQuestion ? "open" : currentQuestionIndex === totalQuestions ? "completed" : "question_waiting");
	}, []);
};
