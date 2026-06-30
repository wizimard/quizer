import { useForm, type Resolver } from "react-hook-form";
import type { ISettingsQuizForm } from "../model/settingsQuizForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsQuizFormValidationSchema } from "../model/settingsQuizForm";
import { normalizeQuiz, type TQuiz } from "@entities/quiz";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/api";
import type { QuizResponse, QuizSettingsUpdateRequestBody } from "@shared/api/generated";
import type { AxiosResponse } from "axios";
import { useCallback, useEffect } from "react";
import { useSettingsFormStore } from "../model/settingsFormStore";

function updateQuizSettings(quizId: string, data: ISettingsQuizForm, deletedAvailablePeriods: Array<number>): Promise<AxiosResponse<QuizResponse, unknown, object>> {
	const addPeriods = data.availablePeriods.filter((period) => period.id === null);
	const updatePeriods = data.availablePeriods.filter((period) => period.id !== null);

	const body: QuizSettingsUpdateRequestBody = {
		id: quizId,

		available_periods: {
			add: addPeriods.map((period) => ({
				id: period.id,
				available_from: period.available_from.toISOString(),
				available_to: period.available_to?.toISOString(),
			})),
			update: updatePeriods.map((period) => ({
				id: period.id,
				available_from: period.available_from.toISOString(),
				available_to: period.available_to?.toISOString(),
			})),
			remove: deletedAvailablePeriods,
		},

		isRequiredEmail: data.isRequiredEmail,
		isRequiredFirstName: data.isRequiredFirstName,
		isRequiredLastName: data.isRequiredLastName,
		isShowAnswersAfterCompletion: data.isShowAnswersAfterCompletion,
	};

	return api.quizIdSettingsPatch(quizId, body);
}

export function useSettingsQuizForm(quiz: TQuiz) {
	const {
		control,
		handleSubmit,
		formState: { isSubmitting, isDirty },
		reset,
	} = useForm<ISettingsQuizForm>({
		defaultValues: {
			availablePeriods: quiz.settings.availablePeriods.map((period) => ({
				...period,
				periodId: period.id,
			})),
			isRequiredEmail: quiz.settings.isRequiredEmail,
			isRequiredFirstName: quiz.settings.isRequiredFirstName,
			isRequiredLastName: quiz.settings.isRequiredLastName,
			isShowAnswersAfterCompletion: quiz.settings.isShowAnswersAfterCompletion,
		},
		resolver: zodResolver(settingsQuizFormValidationSchema) as Resolver<ISettingsQuizForm>,
	});

	const deletedAvailablePeriods: Array<number> = useSettingsFormStore((state) => state.deletedAvailablePeriods);
	const clearDeletedAvailablePeriods = useSettingsFormStore((state) => state.clearDeletedAvailablePeriods);

	const queryClient = useQueryClient();

	const quizSettingsMutation = useMutation({
		mutationFn: (formData: ISettingsQuizForm) => {
			return updateQuizSettings(quiz.id, formData, deletedAvailablePeriods);
		},
		onSuccess: (response) => {
			queryClient.setQueryData(["quiz", quiz.id], normalizeQuiz(response.data));
		},
	});

	const resetForm = useCallback(() => {
		reset({
			availablePeriods: quiz.settings.availablePeriods.map((period) => ({
				...period,
				periodId: period.id,
			})),
			isRequiredEmail: quiz.settings.isRequiredEmail,
			isRequiredFirstName: quiz.settings.isRequiredFirstName,
			isRequiredLastName: quiz.settings.isRequiredLastName,
			isShowAnswersAfterCompletion: quiz.settings.isShowAnswersAfterCompletion,
		});

		clearDeletedAvailablePeriods();
	}, [reset, clearDeletedAvailablePeriods, quiz.settings]);

	useEffect(() => {
		resetForm();
	}, [resetForm]);

	const submitHandler = handleSubmit((data: ISettingsQuizForm) => {
		quizSettingsMutation.mutate(data);
	});

	return { control, submitHandler, isSubmitting: isSubmitting || quizSettingsMutation.isPending, isDirty, resetForm };
}
