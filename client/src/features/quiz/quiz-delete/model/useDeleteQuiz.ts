import { api } from "@shared/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useDeleteQuiz = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (quizId: string) => api.quizIdDelete(quizId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["quizes"] });
			navigate("/");
		},
	});
};
