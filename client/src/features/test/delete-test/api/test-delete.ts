import { useQueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { testApi } from "@shared/api";
import { DIALOG_KEYS, useLockDialog } from "@shared/model";
import { QUERY_KEYS } from "@shared/constant";

export const useTestDelete = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { lockDialog, unlockDialog } = useLockDialog(DIALOG_KEYS.DELETE_TEST);

	const testDeleteMutation = useMutation({
		mutationFn: (testId: string) => {
			lockDialog();
			return testApi.testTestIdDelete(testId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_AUTHOR_TESTS] });
			navigate("/");
		},
		onError: (error) => {
			if (!(error instanceof AxiosError) || !error.response?.data?.message) {
				console.error(error);
				setErrorMessage("errors.unknown_error");
				return;
			}
			setErrorMessage(error.response.data.message);
		},
		onSettled: () => {
			unlockDialog();
		},
	});

	const handleDelete = (testId: string) => {
		testDeleteMutation.mutate(testId);
	};

	return {
		errorMessage,
		isLoading: testDeleteMutation.isPending,
		handleDelete,
	};
};
