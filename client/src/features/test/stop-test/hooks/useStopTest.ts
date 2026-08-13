import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { stopTest, type StoppableTest } from "../api/stopTest";
import { QUERY_KEYS } from "@shared/constant";
import type { TestFinishResponse } from "@shared/api/generated";
import { DIALOG_KEYS, useDialog } from "@shared/model";

export type { StoppableTest };

export const useStopTest = (test: StoppableTest) => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { lockDialog, unlockDialog } = useDialog(DIALOG_KEYS.STOP_TEST);

	const stopTestMutation = useMutation({
		mutationFn: async () => {
			lockDialog();
			return stopTest(test);
		},
		onSuccess: async (data: AxiosResponse<TestFinishResponse>) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_FULL_TEST, test.id] }),
				queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_AUTHOR_TESTS] }),
				queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_TEST_EXECUTION_OVERVIEW, test.id] }),
				queryClient.refetchQueries({ queryKey: [QUERY_KEYS.GET_FULL_TEST, test.id] }),
				queryClient.refetchQueries({ queryKey: [QUERY_KEYS.GET_TEST_EXECUTION_OVERVIEW, test.id] }),
			]);

			navigate(`/test-history/${test.id}/${data.data.session_id}`);
		},
		onError: (error) => {
			// TODO: handle error
			console.error(error);
		},
		onSettled: () => {
			unlockDialog();
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
