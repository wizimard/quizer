import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ButtonQuizStart, type TQuiz } from "@entities/quiz";
import { api } from "@shared/api";

export interface IQuizStartProps {
	quiz: TQuiz;
}

export const QuizStart = ({ quiz }: IQuizStartProps) => {
	const queryClient = useQueryClient();

	const startQuizMutation = useMutation({
		mutationFn: async () => {
			return api.quizQuizIdStartPost(quiz.id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["quiz", quiz.id] });
		},
		onError: (error) => {
			// TODO: handle error
			console.error(error);
		},
	});

	const handleClick = () => {
		startQuizMutation.mutate();
	};

	return <ButtonQuizStart onClick={handleClick} disabled={quiz.questions.length === 0} />;
};
