import { api } from "@shared/api";
import { type QuizResponse } from "@shared/api/generated";
import { useApi } from "@shared/hooks";
import { useCallback, useEffect } from "react";
import { useQuiz } from "../model/store";

export const useGetQuizes = () => {
	const callback = useCallback(() => api.quizGet(), []);

	const { data, isLoading, error } = useApi<QuizResponse[]>(callback);

	const setQuizes = useQuiz((state) => state.setQuizes);

	useEffect(() => {
		setQuizes(data);
	}, [data, setQuizes]);

	return { isLoading, error };
};
