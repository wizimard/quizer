import type { TQuiz } from "../model/quiz.interface";
import type { QuizResponse } from "@shared/api/generated";

export function normalizeQuiz(quiz: QuizResponse): TQuiz {
	quiz.questions.sort((a, b) => a.sortKey - b.sortKey);

	const availablePeriods = quiz.settings.availablePeriods.map((period) => ({
		...period,
		available_from: new Date(period.available_from),
		available_to: period.available_to ? new Date(period.available_to) : null,
	}));

	availablePeriods.sort((a, b) => a.available_from.getTime() - b.available_from.getTime());

	return {
		...quiz,
		settings: {
			...quiz.settings,
			availablePeriods,
		},
	};
}
