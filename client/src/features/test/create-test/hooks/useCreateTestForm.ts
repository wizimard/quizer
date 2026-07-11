import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, type AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { createTestForm, type CreateTestForm } from "../model/createTestForm";
import { testApi } from "@shared/api";
import type { TestResponse } from "@shared/api/generated";

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

	const queryClient = useQueryClient();

	const navigate = useNavigate();

	const testCreateMutation = useMutation({
		mutationFn: (data: CreateTestForm) => {
			return testApi.testPost(data);
		},
		onSuccess: (response: AxiosResponse<TestResponse>) => {
			queryClient.invalidateQueries({ queryKey: ["tests"] });
			navigate(`/test/${response.data.id}`);
		},
		onError: (error) => {
			if (!(error instanceof AxiosError) || !error.response?.data?.message) {
				setError("root", { message: "errors.unknown_error" });
				return;
			}
			setError("root", { message: error.response.data.message });
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
