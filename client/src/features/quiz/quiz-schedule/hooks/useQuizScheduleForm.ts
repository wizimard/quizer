import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useCallback, useEffect } from "react";
import type { IScheduleForm } from "../model/scheduleForm";
import { scheduleFormValidationSchema } from "../model/scheduleForm";
import { useScheduleFormStore } from "../store/scheduleFormStore";
import { updateQuizSchedule } from "../api/updateSchedule";
import { normalizeQuiz, type TQuiz } from "@entities/quiz";

export function useQuizScheduleForm(quiz: TQuiz) {
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
	} = useForm<IScheduleForm>({
		defaultValues: {
			availablePeriods: quiz.settings.availablePeriods.map((period) => ({
				...period,
				periodId: period.id,
			})),
		},
		resolver: zodResolver(scheduleFormValidationSchema) as Resolver<IScheduleForm>,
	});

	const deletedAvailablePeriods: Array<number> = useScheduleFormStore((state) => state.deletedAvailablePeriods);
	const clearDeletedAvailablePeriods = useScheduleFormStore((state) => state.clearDeletedAvailablePeriods);

	const queryClient = useQueryClient();

	const quizScheduleMutation = useMutation({
		mutationFn: (formData: IScheduleForm) => {
			return updateQuizSchedule(quiz.id, formData, deletedAvailablePeriods);
		},
		onSuccess: (response) => {
			queryClient.setQueryData(["quiz", quiz.id], normalizeQuiz(response.data));
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
			availablePeriods: quiz.settings.availablePeriods.map((period) => ({
				...period,
				periodId: period.id,
			})),
		});

		clearDeletedAvailablePeriods();
	}, [reset, clearDeletedAvailablePeriods, quiz.settings]);

	useEffect(() => {
		resetForm();
	}, [resetForm]);

	const submitHandler = handleSubmit((data: IScheduleForm) => {
		clearErrors("root");

		quizScheduleMutation.mutate(data);
	});

	return { control, submitHandler, isSubmitting: isSubmitting || quizScheduleMutation.isPending, isDirty, resetForm, formError };
}
