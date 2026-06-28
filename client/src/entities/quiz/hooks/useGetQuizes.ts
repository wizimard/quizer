import { api } from "@shared/api";
import { type QuizResponse } from "@shared/api/generated";
import { useEffect } from "react";
import { useQuiz } from "../model/store";
import { useQuery } from "@tanstack/react-query";

export const useGetQuizes = () => {
	const { data, isLoading, error } = useQuery<QuizResponse[]>({
		queryKey: ["quizes"],
		queryFn: async () => {
			const response = await api.quizGet();
			return response.data;
		},
	});

	const setQuizes = useQuiz((state) => state.setQuizes);

	useEffect(() => {
		setQuizes(data);
	}, [data, setQuizes]);

	return { isLoading, error };
};
