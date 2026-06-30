import type { QuizResponse } from "@shared/api/generated";
import type { TQuiz } from "../model/quiz.interface";

export function normalizeQuiz(quiz: QuizResponse): TQuiz {
	return {
		...quiz,
		settings: {
			...quiz.settings,
			availablePeriods: quiz.settings.availablePeriods.map((period) => ({
				...period,
				available_from: new Date(period.available_from),
				available_to: period.available_to ? new Date(period.available_to) : null,
			})),
		},
	};
}
