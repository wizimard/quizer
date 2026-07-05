import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { AxiosError } from "axios";
import { generalSettingsFormValidationSchema, type IGeneralSettingsQuiz } from "../model/generalSettingsForm";
import { normalizeQuiz, type TQuiz } from "@entities/quiz";
import { api } from "@shared/api";

export function useGeneralSettingsQuizForm(quiz: TQuiz) {
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
	} = useForm<IGeneralSettingsQuiz>({
		defaultValues: {
			title: quiz.title,
			isRequiredEmail: quiz.settings.isRequiredEmail,
			isRequiredFirstName: quiz.settings.isRequiredFirstName,
			isRequiredLastName: quiz.settings.isRequiredLastName,
			isShowAnswersAfterCompletion: quiz.settings.isShowAnswersAfterCompletion,
		},
		resolver: zodResolver(generalSettingsFormValidationSchema) as Resolver<IGeneralSettingsQuiz>,
	});

	const queryClient = useQueryClient();

	const quizSettingsMutation = useMutation({
		mutationFn: (formData: IGeneralSettingsQuiz) => {
			return api.quizQuizIdSettingsPatch(quiz.id, formData);
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
			title: quiz.title,
			isRequiredEmail: quiz.settings.isRequiredEmail,
			isRequiredFirstName: quiz.settings.isRequiredFirstName,
			isRequiredLastName: quiz.settings.isRequiredLastName,
			isShowAnswersAfterCompletion: quiz.settings.isShowAnswersAfterCompletion,
		});
	}, [reset, quiz.settings, quiz.title]);

	useEffect(() => {
		resetForm();
	}, [resetForm]);

	const submitHandler = handleSubmit((data: IGeneralSettingsQuiz) => {
		clearErrors("root");

		quizSettingsMutation.mutate(data);
	});

	return { control, submitHandler, isSubmitting: isSubmitting || quizSettingsMutation.isPending, isDirty, resetForm, formError };
}
