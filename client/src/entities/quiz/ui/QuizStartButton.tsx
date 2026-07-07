import { Play, Square } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TQuiz } from "../model/quiz.interface";
import { getOpenPeriod } from "../lib/getOpenPeriod";
import { isOpenQuiz } from "../lib/isOpenQuiz";
import { Button } from "@shared/ui/kit/button";
import { cn } from "@shared/lib/utils";
import { api } from "@shared/api";
import { QuizResponseStatusEnum } from "@shared/api/generated";

export interface IQuizStartButton {
	quiz: TQuiz;
}

function changeQuizStatus(quiz: TQuiz) {
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

	return api.quizQuizIdStartPost(quiz.id);
}

export const QuizStartButton = ({ quiz }: IQuizStartButton) => {
	const { t } = useTranslation();

	const queryClient = useQueryClient();

	const runQuizMutation = useMutation({
		mutationFn: async () => {
			return await changeQuizStatus(quiz);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["quiz", quiz.id] });
		},
		onError: (error) => {
			console.error(error);
		},
	});

	const handleClick = () => {
		runQuizMutation.mutate();
	};

	const isOpen = isOpenQuiz(quiz.status);

	return (
		<Button
			variant="outline"
			size="sm"
			className={cn(
				"gap-1.5 font-medium uppercase",
				isOpen
					? "border-border text-muted-foreground hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
					: "border-green-600/30 bg-green-500/10 text-green-600 hover:bg-green-500/20 hover:text-green-700 dark:border-green-500/30 dark:text-green-500 dark:hover:bg-green-500/20 dark:hover:text-green-400",
			)}
			onClick={handleClick}
		>
			{isOpen ? (
				<>
					<Square className="size-3.5 fill-current" />
					{t("quiz.close")}
				</>
			) : (
				<>
					<Play className="size-3.5 fill-current" />
					{t("quiz.start")}
				</>
			)}
		</Button>
	);
};
