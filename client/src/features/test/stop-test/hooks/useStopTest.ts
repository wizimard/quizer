import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stopTest } from "../api/stopTest";
import type { Test } from "@entities/test";
import { QUERY_KEYS } from "@shared/constant";

export const useStopTest = (test: Test) => {
	const queryClient = useQueryClient();

	const stopTestMutation = useMutation({
		mutationFn: async () => {
			return stopTest(test);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_TEST_EXECUTION, test.id] });
		},
		onError: (error) => {
			// TODO: handle error
			console.error(error);
		},
	});

	const handleStopTest = () => {
		stopTestMutation.mutate();
	};

	return {
		stopTest: handleStopTest,
		isLoading: stopTestMutation.isPending,
	};
};
