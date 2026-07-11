import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useCallback, useEffect } from "react";
import { scheduleFormValidationSchema, type ScheduleForm } from "../model/scheduleForm";
import { useScheduleFormStore } from "../store/scheduleFormStore";
import { updateTestSchedule } from "../api/updateTestSchedule";
import { normalizeTestFull, type TestFull } from "@entities/test";
import type { TestFullResponse } from "@shared/api/generated";

export function useTestScheduleForm(test: TestFull) {
	const {
		control,
		handleSubmit,
		formState: {
			isSubmitting,
			isDirty,
			errors: { root: formError },
		},
		reset,
		setError,
		clearErrors,
	} = useForm<ScheduleForm>({
		defaultValues: {
			schedulePeriods: test.schedulerPeriods.map((period) => ({
				...period,
				periodId: period.id,
			})),
		},
		resolver: zodResolver(scheduleFormValidationSchema) as Resolver<ScheduleForm>,
	});

	const deletedSchedulePeriods: Array<number> = useScheduleFormStore((state) => state.deletedSchedulePeriods);
	const clearDeletedSchedulePeriods = useScheduleFormStore((state) => state.clearDeletedSchedulePeriods);

	const queryClient = useQueryClient();

	const testScheduleMutation = useMutation({
		mutationFn: (formData: ScheduleForm) => {
			return updateTestSchedule(test.id, formData, deletedSchedulePeriods);
		},
		onSuccess: (response) => {
			queryClient.setQueriesData({ queryKey: ["test", test.id] }, (oldData: TestFullResponse) => {
				if (!oldData) return oldData;

				return normalizeTestFull({ ...oldData, scheduler: response.data });
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
	});

	const resetForm = useCallback(() => {
		reset({
			schedulePeriods: test.schedulerPeriods.map((period) => ({
				...period,
				periodId: period.id,
			})),
		});

		clearDeletedSchedulePeriods();
	}, [reset, clearDeletedSchedulePeriods, test.schedulerPeriods]);

	useEffect(() => {
		resetForm();
	}, [resetForm]);

	const submitHandler = handleSubmit((data: ScheduleForm) => {
		clearErrors("root");

		testScheduleMutation.mutate(data);
	});

	return { control, submitHandler, isSubmitting: isSubmitting || testScheduleMutation.isPending, isDirty, resetForm, formError };
}
