import { type AxiosResponse } from "axios";
import type { ScheduleForm } from "../model/scheduleForm";
import { testApi } from "@shared/api";
import type { TestSchedulerPeriodAddDto, TestSchedulerPeriodEditDto, TestSchedulerResponse, TestSchedulerPeriodsEditRequestBody } from "@shared/api/generated";

export function updateTestScheduler(testId: string, data: ScheduleForm): Promise<AxiosResponse<TestSchedulerResponse>> {
	const addPeriods = data.schedulePeriods.filter((period) => !period.isDeleted && !period.periodId);
	const updatePeriods = data.schedulePeriods.filter((period) => !period.isDeleted && period.periodId);

	const deletedPeriods: Array<number> = data.schedulePeriods.filter((period) => period.isDeleted && period.id).map<number>((period) => period.periodId as number);

	const body: TestSchedulerPeriodsEditRequestBody = {
		add: addPeriods.map((period) => ({
			id: period.id,
			available_from: period.availableFrom.toISOString(),
			available_to: period.availableTo?.toISOString(),
		})) as Array<TestSchedulerPeriodAddDto>,
		update: updatePeriods.map((period) => ({
			id: period.periodId,
			available_from: period.availableFrom.toISOString(),
			available_to: period.availableTo?.toISOString(),
		})) as Array<TestSchedulerPeriodEditDto>,
		remove: deletedPeriods,
	};

	return testApi.testTestIdSchedulerPeriodsPatch(testId, body);
}
