import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/api";
import { type QuizResponse } from "@shared/api/generated";

export const useGetQuizes = () => {
	const { data, isLoading, error } = useQuery<QuizResponse[]>({
		queryKey: ["quizes"],
		queryFn: async () => {
			const response = await api.quizGet();
			return response.data;
		},
	});

	return { isLoading, error, quizes: data };
};
