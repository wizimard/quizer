import { type AxiosResponse } from "axios";
import type { ScheduleForm } from "../model/scheduleForm";
import { testApi } from "@shared/api";
import type { TestSchedulerPeriodAddDto, TestSchedulerPeriodEditDto, TestSchedulerResponse, TestSchedulerPeriodsEditRequestBody } from "@shared/api/generated";

export function updateTestSchedule(testId: string, data: ScheduleForm, deletedAvailablePeriods: Array<number>): Promise<AxiosResponse<TestSchedulerResponse>> {
	const addPeriods = data.schedulePeriods.filter((period) => !period.id);
	const updatePeriods = data.schedulePeriods.filter((period) => period.id);

	const body: TestSchedulerPeriodsEditRequestBody = {
		add: addPeriods.map((period) => ({
			id: period.id,
			available_from: period.availableFrom.toISOString(),
			available_to: period.availableTo?.toISOString(),
		})) as Array<TestSchedulerPeriodAddDto>,
		update: updatePeriods.map((period) => ({
			id: period.id,
			available_from: period.availableFrom.toISOString(),
			available_to: period.availableTo?.toISOString(),
		})) as Array<TestSchedulerPeriodEditDto>,
		remove: deletedAvailablePeriods,
	};

	return testApi.testTestIdSchedulerPeriodsPatch(testId, body);
}
