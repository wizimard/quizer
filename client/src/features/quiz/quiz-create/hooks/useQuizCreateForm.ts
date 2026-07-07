import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, type AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { quizCreateForm, type TQuizCreateForm } from "../model/quizCreateForm";
import { api } from "@shared/api";
import type { QuizResponse } from "@shared/api/generated";

export const useQuizCreateForm = () => {
	const {
		control,
		formState: {
			errors: { root: formError },
			isLoading,
			isSubmitting,
		},
		handleSubmit,
		setError,
	} = useForm<TQuizCreateForm>({
		resolver: zodResolver(quizCreateForm),
		defaultValues: {
			title: "",
		},
	});

	const queryClient = useQueryClient();

	const navigate = useNavigate();

	const quizCreateMutation = useMutation({
		mutationFn: (data: TQuizCreateForm) => {
			return api.quizPost(data);
		},
		onSuccess: (response: AxiosResponse<QuizResponse>) => {
			queryClient.invalidateQueries({ queryKey: ["quizzes"] });
			navigate(`/quiz/${response.data.id}`);
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
		quizCreateMutation.mutate(data);
	});

	return {
		control,
		formError,
		isLoading: isLoading || isSubmitting || quizCreateMutation.isPending,
		handleSubmit: submitHandler,
	};
};
