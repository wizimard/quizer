import { api } from "@shared/api";
import { type QuizResponse } from "@shared/api/generated";
import { useApi } from "@shared/hooks";
import { useCallback, useEffect } from "react";
import { useQuiz } from "../model/store";

export const useGetQuiz = (id: string) => {
	const callback = useCallback(() => {
		if (id === "new") {
			return {
				id: "new_quiz",
				authorId: "",
				title: "",
				questions: [],
				updatedAt: "",
				createdAt: "",
			};
		}
		return api.quizIdGet(id);
	}, [id]);

	const { data, isLoading, error } = useApi<QuizResponse>(callback);

	const setSelectedQuiz = useQuiz((state) => state.setSelectedQuiz);

	useEffect(() => {
		setSelectedQuiz(data);
	}, [data, setSelectedQuiz]);

	return { isLoading, error };
};
