import { useMutation } from "@tanstack/react-query";
import { AxiosError, type AxiosResponse } from "axios";
import type { UseFormSetError } from "react-hook-form";
import type { QuestionAnswerFormValues } from "../model/question-answer-form";
import { testExecutionApi } from "@shared/api";
import { useSetExecutionState, useTestExecutionStore } from "@entities/test";
import type { TestRegisteredUserResponse } from "@shared/api/generated";
import { normalizeExecutionQuestion } from "@entities/question/lib/normalizeQuestion";

interface AnswerQuestionPayload {
	answer?: string;
	skipped?: boolean;
}

export const useAnswerQuestion = (testId: string, questionId: string, setError: UseFormSetError<QuestionAnswerFormValues>) => {
	const setExecutionState = useSetExecutionState();

	const user = useTestExecutionStore((state) => state.user);

	const answerQuestionMutation = useMutation({
		mutationFn: async (data: AnswerQuestionPayload) => {
			return await testExecutionApi.testExecuteTestIdQuestionIdAnswerPost(testId, questionId, {
				user_id: user!.id,
				answer: data.answer,
				skipped: data.skipped,
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
			if (error instanceof AxiosError && error.response?.data?.message) {
				setError("root", { message: error.response?.data?.message });
				return;
			}

			setError("root", { message: "errors.unknown_error" });
		},
	});

	return {
		isLoading: answerQuestionMutation.isPending,
		answerQuestion: answerQuestionMutation.mutate,
	};
};
