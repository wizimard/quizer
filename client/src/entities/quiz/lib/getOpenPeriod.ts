import type { TQuiz } from "../model/quiz.interface";

export function getOpenPeriod(quiz: TQuiz) {
	const now = new Date();

	return quiz.settings.availablePeriods.find((period) => {
		return period.available_from <= now && (!period.available_to || period.available_to >= now);
	});
}
