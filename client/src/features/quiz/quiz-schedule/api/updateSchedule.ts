import { type AxiosResponse } from "axios";
import type { IScheduleForm } from "../model/scheduleForm";
import { api } from "@shared/api";
import type { QuizResponse, QuizAvailablePeriodEdit, QuizAvailableEditRequestBody } from "@shared/api/generated";

export function updateQuizSchedule(quizId: string, data: IScheduleForm, deletedAvailablePeriods: Array<number>): Promise<AxiosResponse<QuizResponse, unknown, object>> {
	const addPeriods = data.availablePeriods.filter((period) => period.id === null);
	const updatePeriods = data.availablePeriods.filter((period) => period.id !== null);

	const body: QuizAvailableEditRequestBody = {
		add: addPeriods.map((period) => ({
			id: period.id,
			available_from: period.available_from.toISOString(),
			available_to: period.available_to?.toISOString(),
		})) as Array<QuizAvailablePeriodEdit>,
		update: updatePeriods.map((period) => ({
			id: period.id,
			available_from: period.available_from.toISOString(),
			available_to: period.available_to?.toISOString(),
		})) as Array<QuizAvailablePeriodEdit>,
		remove: deletedAvailablePeriods,
	};

	return api.quizQuizIdSettingsAvailablePeriodsPatch(quizId, body);
}
