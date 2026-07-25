import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import type { UseFormSetError } from "react-hook-form";
import { AxiosError, type AxiosResponse } from "axios";
import type { TestRegisterUserFormValues } from "../model/registerForm";
import { testExecutionApi } from "@shared/api";
import { useSetExecutionState } from "@entities/test";
import type { TestRegisteredUserResponse } from "@shared/api/generated";
import { normalizeExecutionQuestion } from "@entities/question/lib/normalizeQuestion";

export const useTestRegisterUser = (testId: string, setError: UseFormSetError<TestRegisterUserFormValues>) => {
	const setExecutionState = useSetExecutionState();

	const testRegisterUserMutation = useMutation({
		mutationFn: (data: TestRegisterUserFormValues) => {
			return testExecutionApi.testExecuteTestIdRegisterPost(testId, {
				first_name: data.first_name,
				last_name: data.last_name,
			});
		},
		onSuccess: ({ data }: AxiosResponse<TestRegisteredUserResponse>) => {
			setExecutionState(
				testId,
				{
					id: data.id,
					first_name: data.first_name,
					last_name: data.last_name,
				},
				data.current_question ? normalizeExecutionQuestion(data.current_question) : null,
				data.current_question_index,
				data.total_questions_count,
			);
		},
		onError: (error) => {
			console.error(error);
			if (error instanceof AxiosError && error.response?.data?.message) {
				setError("root", { message: error.response?.data?.message });
				return;
			}

			setError("root", { message: "errors.unknown_error" });
		},
	});

	const registerUser = useCallback(
		(data: TestRegisterUserFormValues) => {
			testRegisterUserMutation.mutate(data);
		},
		[testRegisterUserMutation],
	);

	return {
		isLoading: testRegisterUserMutation.isPending,
		error: testRegisterUserMutation.error,
		registerUser: registerUser,
	};
};
