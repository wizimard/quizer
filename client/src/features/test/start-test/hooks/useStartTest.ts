import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { startTest } from "../api/startTest";
import type { StartTestForm } from "../model/startTestForm";
import { QUERY_KEYS } from "@shared/constant";
import { DIALOG_KEYS, useDialog } from "@shared/model";

export function useStartTest(testId: string) {
	const { closeDialog, lockDialog, unlockDialog } = useDialog(DIALOG_KEYS.START_TEST);

	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const startTestMutation = useMutation({
		mutationFn: (data: StartTestForm) => {
			lockDialog();
			return startTest(testId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_FULL_TEST, testId, QUERY_KEYS.GET_AUTHOR_TESTS] });
			queryClient.refetchQueries({ queryKey: [QUERY_KEYS.GET_FULL_TEST, testId] });

			closeDialog();

			navigate(`/test-execution-overview/${testId}`);
		},
		onError: (error) => {
			// TODO: handle error
			console.error(error);
		},
		onSettled: () => {
			unlockDialog();
		},
	});

	return {
		isLoading: startTestMutation.isPending,
		handleStart: startTestMutation.mutate,
	};
}
