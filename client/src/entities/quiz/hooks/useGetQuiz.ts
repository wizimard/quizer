import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { normalizeQuiz, type TQuiz } from "..";
import { api } from "@shared/api";
import { QUIZ_NEW_ID } from "@shared/constant";

export const useGetQuiz = (id: string) => {
	const { data, isLoading, error } = useQuery<TQuiz>({
		queryKey: ["quiz", id],
		queryFn: async () => {
			if (id === QUIZ_NEW_ID) {
				return {
					id: "new_quiz",
					authorId: "",
					title: "",
					questions: [],
					settings: {
						availablePeriods: [],
						isRequiredEmail: false,
						isRequiredFirstName: false,
						isRequiredLastName: false,
						isShowAnswersAfterCompletion: false,
					},
					updatedAt: "",
					createdAt: "",
				};
			}

			const response = await api.quizQuizIdGet(id);

			return normalizeQuiz(response.data);
		},
	});

	const isForbidden = error instanceof AxiosError && error.response?.status === 403;

	return { isLoading, error, isForbidden, quiz: data as TQuiz };
};
