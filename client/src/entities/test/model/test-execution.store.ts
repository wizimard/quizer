import { create } from "zustand";
import type { QuestionExecution } from "@entities/question/model/question-execution.interface";

export interface TestExecutionUser {
	id: string;
	first_name: string;
	last_name: string;
}

export type TestExecutionStatus = "waiting" | "open" | "question_waiting" | "completed" | "finished" | "closed";

export interface TestExecutionStore {
	testId: string | null;
	user: TestExecutionUser | null;
	status: TestExecutionStatus;

	currentQuestion: QuestionExecution | null;
	currentQuestionIndex: number;
	totalQuestions: number;

	setTestId: (testId: string) => void;
	setUser: (user: TestExecutionUser | null) => void;
	setCurrentQuestion: (question: QuestionExecution | null) => void;
	setCurrentQuestionIndex: (index: number) => void;
	setTotalQuestionsCount: (total: number) => void;
	setStatus: (status: TestExecutionStatus) => void;
}

export const useTestExecutionStore = create<TestExecutionStore>((set) => ({
	testId: null,
	user: null,
	currentQuestion: null,
	status: "closed",

	currentQuestionIndex: 0,
	totalQuestions: 0,

	setTestId: (testId: string) => set({ testId }),

	setUser: (user: TestExecutionUser | null) => set({ user }),

	setStatus: (status: TestExecutionStatus) => {
		set({ status });
	},

	setCurrentQuestion: (question: QuestionExecution | null) => set({ currentQuestion: question }),
	setCurrentQuestionIndex: (index: number) => set({ currentQuestionIndex: index }),
	setTotalQuestionsCount: (total: number) => set({ totalQuestions: total }),
}));
