import type { QuizResponse } from "@shared/api/generated";
import { create } from "zustand";

export interface IQuizState {
	selectedQuiz: QuizResponse | null;
	setSelectedQuiz(quiz: QuizResponse | null): void;
	quizes: QuizResponse[];
	setQuizes(quizes: QuizResponse[]): void;
}

export const useQuiz = create<IQuizState>((set) => ({
	quizes: [],
	selectedQuiz: null,
	setQuizes(quizes) {
		set((state) => ({ ...state, quizes }));
	},
	setSelectedQuiz: (quiz: QuizResponse | null) => {
		const selectedQuiz: QuizResponse = quiz
			? {
					...quiz,
					questions: quiz.questions.toSorted((question1, question2) => question1.order - question2.order),
				}
			: null;

		set((state) => ({ ...state, selectedQuiz }));
	},
}));
