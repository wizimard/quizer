import { useMutation, useQueryClient } from "@tanstack/react-query";
import { testApi } from "@shared/api";
import { QUERY_KEYS } from "@shared/constant";

export const useStartTest = (testId: string) => {
	const queryClient = useQueryClient();

	const startTestMutation = useMutation({
		mutationFn: async () => {
			return testApi.testTestIdStartPost(testId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_TEST_EXECUTION, testId] });
		},
		onError: (error) => {
			// TODO: handle error
			console.error(error);
		},
	});

	const handleStartTest = () => {
		startTestMutation.mutate();
	};

	return {
		startTest: handleStartTest,
		isLoading: startTestMutation.isPending,
	};
};
