import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stopTest, type StoppableTest } from "../api/stopTest";
import { QUERY_KEYS } from "@shared/constant";

export type { StoppableTest };

export const useStopTest = (test: StoppableTest) => {
	const queryClient = useQueryClient();

	const stopTestMutation = useMutation({
		mutationFn: async () => {
			return stopTest(test);
		},
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_FULL_TEST, test.id] }),
				queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_AUTHOR_TESTS] }),
				queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_TEST_EXECUTION_OVERVIEW, test.id] }),
				queryClient.refetchQueries({ queryKey: [QUERY_KEYS.GET_FULL_TEST, test.id] }),
				queryClient.refetchQueries({ queryKey: [QUERY_KEYS.GET_TEST_EXECUTION_OVERVIEW, test.id] }),
			]);
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
