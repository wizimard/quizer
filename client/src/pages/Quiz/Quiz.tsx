import { useParams } from "react-router-dom";
import { QuizToolbar } from "./ui/QuizToolbar";
import { useGetQuiz } from "@entities/quiz";
import { LoadingLayout } from "@shared/ui/layout";
import { QuizQuestionsWidget } from "@widgets/QuizQuestions";
import { Separator } from "@shared/ui/kit/separator";

export const Quiz = () => {
	const { id } = useParams();

	const { isLoading, isForbidden, quiz } = useGetQuiz(id as string);

	return (
		<LoadingLayout isLoading={isLoading} error={isForbidden ? new Error("quiz.errors.forbidden") : undefined}>
			<>
				{!!quiz && (
					<div className="flex min-h-a w-full shrink flex-col gap-2.5 px-10 pt-5 pb-2.5">
						<QuizToolbar quiz={quiz} />
						<Separator />
						<QuizQuestionsWidget quiz={quiz} />
					</div>
				)}
			</>
		</LoadingLayout>
	);
};
