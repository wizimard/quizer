import { useQueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { FormState, UseFormSetError } from "react-hook-form";
import type { ScheduleForm } from "../model/scheduleForm";
import { updateTestScheduler } from "../api/updateTestScheduler";
import type { TestFullResponse } from "@shared/api/generated";
import { normalizeTestFull, type TestFull } from "@entities/test";
import { DRAWER_KEYS, useSetDataDrawer, useSetLockDrawer, useSetUnlockDrawer } from "@shared/model";
import { QUERY_KEYS } from "@shared/constant";

export function useUpdateTestScheduler(test: TestFull, setError: UseFormSetError<ScheduleForm>) {
	const setData = useSetDataDrawer(DRAWER_KEYS.TEST_SETTINGS);
	const lock = useSetLockDrawer(DRAWER_KEYS.TEST_SETTINGS);
	const unlock = useSetUnlockDrawer(DRAWER_KEYS.TEST_SETTINGS);

	const queryClient = useQueryClient();

	const testScheduleMutation = useMutation({
		mutationFn: (formData: ScheduleForm) => {
			lock();
			return updateTestScheduler(test.id, formData);
		},
		onSuccess: (response) => {
			queryClient.setQueriesData({ queryKey: [QUERY_KEYS.GET_FULL_TEST, test.id] }, (oldData: TestFullResponse) => {
				if (!oldData) return oldData;

				const newTest = normalizeTestFull({ ...oldData, scheduler: response.data });

				setData(newTest);

				return newTest;
			});
		},
		onError: (error) => {
			if (!(error instanceof AxiosError) || !error.response?.data?.message) {
				console.error(error);
				setError("root", { message: "errors.unknown_error" });
				return;
			}

			setError("root", { message: error.response.data.message });
		},
		onSettled: () => {
			unlock();
		},
	});

	const handleUpdate = (formData: ScheduleForm, dirtyFields: FormState<ScheduleForm>["dirtyFields"]) => {
		if (!dirtyFields.schedulePeriods) {
			return;
		}

		testScheduleMutation.mutate({
			schedulePeriods: formData.schedulePeriods.filter((_, index) => !!dirtyFields.schedulePeriods![index]),
		});
	};

	return {
		isLoading: testScheduleMutation.isPending,
		handleUpdate,
	};
}
