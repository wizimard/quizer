import { useMutation, useQueryClient } from "@tanstack/react-query";
import { nextQuestion } from "../api/nextQuestion";
import { resolveTargetQuestionId } from "../lib/resolveTargetQuestionId";
import { normalizeTestExecutionOverview, type TestExecutionOverview } from "@entities/test";
import { QUERY_KEYS } from "@shared/constant";

export const useNextQuestion = (testOverview: TestExecutionOverview) => {
	const queryClient = useQueryClient();
	const targetQuestionId = resolveTargetQuestionId(testOverview);

	const nextQuestionMutation = useMutation({
		mutationFn: async () => {
			if (!targetQuestionId) {
				throw new Error("No target question");
			}

			return nextQuestion(testOverview.id, targetQuestionId);
		},
		onSuccess: async (response) => {
			queryClient.setQueryData([QUERY_KEYS.GET_TEST_EXECUTION_OVERVIEW, testOverview.id], normalizeTestExecutionOverview(response.data));
		},
		onError: (error) => {
			// TODO: handle error
			console.error(error);
		},
	});

	const handleNextQuestion = () => {
		nextQuestionMutation.mutate();
	};

	return {
		nextQuestion: handleNextQuestion,
		isLoading: nextQuestionMutation.isPending,
		canGoNext: targetQuestionId != null,
	};
};
