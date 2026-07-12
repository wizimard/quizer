import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { AxiosResponse, AxiosError } from "axios";
import { useCallback } from "react";
import { type Question, normalizeQuestion } from "@entities/question";
import type { TestFull } from "@entities/test";
import { questionApi } from "@shared/api";
import type { QuestionResponse } from "@shared/api/generated";

export interface ChangeQuestionOrderInput {
	question: Question;
	nextQuestionId?: string;
	previousQuestionId?: string;
}

export const useChangeQuestionOrder = () => {
	const queryClient = useQueryClient();

	const questionOrderChagenMutation = useMutation({
		mutationFn: ({ question, nextQuestionId, previousQuestionId }: ChangeQuestionOrderInput) => {
			return questionApi.questionTestIdQuestionsQuestionIdOrderPatch(question.testId, question.id, {
				next_question_id: nextQuestionId,
				previous_question_id: previousQuestionId,
			});
		},
		onSuccess: (response: AxiosResponse<QuestionResponse[]>) => {
			queryClient.setQueryData(["test", response.data[0].test_id], (oldData: TestFull) => {
				return {
					...oldData,
					questions: response.data.map(normalizeQuestion).toSorted((a, b) => a.sortKey - b.sortKey),
				};
			});
		},
		onError: (error: AxiosError) => {
			console.error(error, error.response);
		},
	});

	const handleChangeQuestionOrder = useCallback(
		({ question, nextQuestionId, previousQuestionId }: ChangeQuestionOrderInput) => {
			questionOrderChagenMutation.mutate({ question, nextQuestionId, previousQuestionId });
		},
		[questionOrderChagenMutation],
	);

	return {
		handleChangeQuestionOrder,
		isLoading: questionOrderChagenMutation.isPending,
	};
};
