import type { QuizResponse } from "@shared/api/generated";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { TQuiz, TQuizAvailablePeriod } from "./quiz.interface";

export interface IQuizState {
	selectedQuiz: TQuiz | null;
	setSelectedQuiz(quiz: QuizResponse | null): void;
	quizes: QuizResponse[];
	setQuizes(quizes: QuizResponse[]): void;
	addAvailablePeriods: (periods: Array<TQuizAvailablePeriod>) => void;
}

export const useQuiz = create<IQuizState>()(
	immer((set) => ({
		quizes: [],
		selectedQuiz: null,
		setQuizes(quizes) {
			set((state) => {
				state.quizes = quizes;
			});
		},
		setSelectedQuiz: (quiz: QuizResponse | null) => {
			if (!quiz) {
				set((state) => {
					state.selectedQuiz = null;
				});
				return;
			}

			const availablePeriods = quiz.settings.availablePeriods.map((period) => ({
				id: period.id,
				quizId: period.quizId,
				available_from: new Date(period.available_from),
				available_to: period.available_to ? new Date(period.available_to) : null,
			}));

			set((state) => {
				state.selectedQuiz = {
					...quiz,
					settings: {
						...quiz.settings,
						availablePeriods,
					},
				};
			});
		},
		addAvailablePeriods: (periods: Array<TQuizAvailablePeriod>) => {
			set((state) => {
				if (state.selectedQuiz) {
					state.selectedQuiz.settings.availablePeriods.push(...periods);
				}
			});
		},
	})),
);
