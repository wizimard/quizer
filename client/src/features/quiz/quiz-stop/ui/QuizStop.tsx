import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/api";
import { QuizResponseStatusEnum } from "@shared/api/generated";
import { ButtonQuizStop, getOpenPeriod, type TQuiz } from "@entities/quiz";

export interface IQuizStopProps {
	quiz: TQuiz;
}

function stopQuizStatus(quiz: TQuiz) {
	if (quiz.status === QuizResponseStatusEnum.ManualOpen) {
		return api.quizQuizIdFinishPost(quiz.id);
	}

	if (quiz.status === QuizResponseStatusEnum.OpenByScheduler) {
		const period = getOpenPeriod(quiz);

		if (!period) {
			throw new Error("No open period found");
		}

		return api.quizQuizIdSettingsAvailablePeriodsPeriodIdClosePatch(quiz.id, period.id);
	}

	throw new Error("Quiz is not open");
}

export const QuizStop = ({ quiz }: IQuizStopProps) => {
	const queryClient = useQueryClient();

	const stopQuizMutation = useMutation({
		mutationFn: async () => {
			return stopQuizStatus(quiz);
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
		stopQuizMutation.mutate();
	};

	return <ButtonQuizStop onClick={handleClick} />;
};
