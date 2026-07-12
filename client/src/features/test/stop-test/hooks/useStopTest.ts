import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stopTest } from "../api/stopTest";
import type { Test } from "@entities/test";

export const useStopTest = (test: Test) => {
	const queryClient = useQueryClient();

	const stopTestMutation = useMutation({
		mutationFn: async () => {
			return stopTest(test);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["test", test.id] });
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
