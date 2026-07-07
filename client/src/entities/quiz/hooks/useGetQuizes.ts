import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/api";
import { type QuizResponseBase } from "@shared/api/generated";

export interface IUseGetQuizes {
	isLoading: boolean;
	error: Error | null;
	quizes: QuizResponseBase[] | undefined;
}

export const useGetQuizes = (): IUseGetQuizes => {
	const { data, isLoading, error } = useQuery<QuizResponseBase[]>({
		queryKey: ["quizes"],
		queryFn: async () => {
			const response = await api.quizGet();
			return response.data;
		},
	});

	return { isLoading, error, quizes: data };
};
