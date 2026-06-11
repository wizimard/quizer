import type { QuizResponse } from "@shared/api/generated";
import { create } from "zustand";

export interface IQuizState {
	selectedQuiz: QuizResponse | null;
	setSelectedQuiz(quiz: QuizResponse): void;
	quizes: QuizResponse[];
	setQuizes(quizes: QuizResponse[]): void;
}

export const useQuiz = create<IQuizState>((set) => ({
	quizes: [],
	selectedQuiz: null,
	setQuizes(quizes) {
		set((state) => ({ ...state, quizes }));
	},
	setSelectedQuiz: (quiz: QuizResponse) => {
		set((state) => ({ ...state, selectedQuiz: quiz }));
	},
}));
