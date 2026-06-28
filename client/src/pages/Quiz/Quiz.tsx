import { useGetQuiz, useQuiz } from "@entities/quiz";
import { Text } from "@shared/ui/text";
import { useParams } from "react-router-dom";
import { QuizToolbar } from "./ui/QuizToolbar";
import { QuizQuestionsList } from "./ui/QuizQuestionsList";
import { LoadingLayout } from "@shared/ui/layout";
import { useTranslation } from "react-i18next";

export const Quiz = () => {
	const { t } = useTranslation();

	const { id } = useParams();

	const { isLoading, isForbidden } = useGetQuiz(id);

	const quiz = useQuiz((state) => state.selectedQuiz);

	return (
		<LoadingLayout isLoading={isLoading} error={isForbidden ? new Error("quiz.errors.forbidden") : undefined}>
			<>
				{!!quiz && (
					<div className="flex min-h-a w-full shrink flex-col gap-2.5 px-10 pt-5 pb-2.5">
						<QuizToolbar quiz={quiz} />
						<Text component="h3" className="text-[1.2rem]">
							{t("quiz.questions")}
						</Text>
						<QuizQuestionsList questions={quiz.questions} />
					</div>
				)}
			</>
		</LoadingLayout>
	);
};
