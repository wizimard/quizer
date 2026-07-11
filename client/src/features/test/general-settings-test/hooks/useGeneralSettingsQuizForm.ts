import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { AxiosError, type AxiosResponse } from "axios";
import { generalSettingsFormValidationSchema, type GeneralSettingsTestForm } from "../model/generalSettingsForm";
import { normalizeTestFull, type TestFull } from "@entities/test";
import { testApi } from "@shared/api";
import type { TestFullResponse } from "@shared/api/generated";

function updateTestSettings(test: TestFull, formData: GeneralSettingsTestForm): Promise<AxiosResponse<TestFullResponse>> {
	return testApi.testTestIdSettingsPatch(test.id, {
		title: formData.title,
		required_email: formData.isRequiredEmail,
		required_first_name: formData.isRequiredFirstName,
		required_last_name: formData.isRequiredLastName,
		show_answers_after_completion: formData.isShowAnswersAfterCompletion,
	});
}

export function useGeneralSettingsTestForm(test: TestFull) {
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
	} = useForm<GeneralSettingsTestForm>({
		defaultValues: {
			title: test.title,
			isRequiredEmail: test.settings.isRequiredEmail,
			isRequiredFirstName: test.settings.isRequiredFirstName,
			isRequiredLastName: test.settings.isRequiredLastName,
			isShowAnswersAfterCompletion: test.settings.isShowAnswersAfterCompletion,
		},
		resolver: zodResolver(generalSettingsFormValidationSchema) as Resolver<GeneralSettingsTestForm>,
	});

	const queryClient = useQueryClient();

	const testSettingsMutation = useMutation({
		mutationFn: (formData: GeneralSettingsTestForm) => {
			return updateTestSettings(test, formData);
		},
		onSuccess: (response: AxiosResponse<TestFullResponse>) => {
			queryClient.setQueryData(["test", test.id], normalizeTestFull(response.data));
		},
		onError: (error: Error) => {
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
			title: test.title,
			isRequiredEmail: test.settings.isRequiredEmail,
			isRequiredFirstName: test.settings.isRequiredFirstName,
			isRequiredLastName: test.settings.isRequiredLastName,
			isShowAnswersAfterCompletion: test.settings.isShowAnswersAfterCompletion,
		});
	}, [reset, test.settings, test.title]);

	useEffect(() => {
		resetForm();
	}, [resetForm]);

	const submitHandler = handleSubmit((data: GeneralSettingsTestForm) => {
		clearErrors("root");

		testSettingsMutation.mutate(data);
	});

	return { control, submitHandler, isSubmitting: isSubmitting || testSettingsMutation.isPending, isDirty, resetForm, formError };
}
