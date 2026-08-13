import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, type AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { createTestForm, type CreateTestForm } from "../model/createTestForm";
import { testApi } from "@shared/api";
import type { TestFullResponse } from "@shared/api/generated";
import { DIALOG_KEYS, useLockDialog } from "@shared/model";
import { QUERY_KEYS } from "@shared/constant";

// TODO: lock, unlock modal
export const useCreateTestForm = () => {
	const {
		control,
		formState: {
			errors: { root: formError },
			isLoading,
			isSubmitting,
		},
		handleSubmit,
		setError,
	} = useForm<CreateTestForm>({
		resolver: zodResolver(createTestForm),
		defaultValues: {
			title: "",
		},
	});

	const { lockDialog, unlockDialog } = useLockDialog(DIALOG_KEYS.CREATE_TEST);

	const queryClient = useQueryClient();

	const navigate = useNavigate();

	const testCreateMutation = useMutation({
		mutationFn: (data: CreateTestForm) => {
			lockDialog();
			return testApi.testPost(data);
		},
		onSuccess: (response: AxiosResponse<TestFullResponse>) => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_AUTHOR_TESTS] });
			navigate(`/test/${response.data.id}`);
		},
		onError: (error) => {
			if (!(error instanceof AxiosError) || !error.response?.data?.message) {
				setError("root", { message: "errors.unknown_error" });
				return;
			}
			setError("root", { message: error.response.data.message });
		},
		onSettled: () => {
			unlockDialog();
		},
	});

	const submitHandler = handleSubmit((data) => {
		testCreateMutation.mutate(data);
	});

	return {
		control,
		formError,
		isLoading: isLoading || isSubmitting || testCreateMutation.isPending,
		handleSubmit: submitHandler,
	};
};
