import { api } from "@shared/api";
import { type QuizResponse } from "@shared/api/generated";
import { useEffect } from "react";
import { useQuiz } from "../model/store";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetQuiz = (id: string) => {
	const { data, isLoading, error } = useQuery<QuizResponse>({
		queryKey: ["quiz", id],
		queryFn: async () => {
			if (id === "new") {
				return {
					id: "new_quiz",
					authorId: "",
					title: "",
					questions: [],
					settings: {
						availablePeriods: [],
					},
					updatedAt: "",
					createdAt: "",
				};
			}

			const response = await api.quizIdGet(id);

			return response.data;
		},
	});

	const isForbidden = error instanceof AxiosError && error.response?.status === 403;

	const setSelectedQuiz = useQuiz((state) => state.setSelectedQuiz);

	useEffect(() => {
		setSelectedQuiz(data);
	}, [data, setSelectedQuiz]);

	return { isLoading, error, isForbidden };
};
