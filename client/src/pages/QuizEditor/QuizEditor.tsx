import { useGetQuiz, useQuiz } from "@entities/quiz";
import { useEditQuizFormModes, QuizEditForm } from "@features/quiz";
import { LoadingLayout } from "@shared/ui/layout";
import { useParams } from "react-router-dom";

export const QuizEditor = () => {
	const { id } = useParams();

	const mode = id === "new" ? useEditQuizFormModes.CREATE : useEditQuizFormModes.UPDATE;

	const { isLoading, error } = useGetQuiz(id);

	const quiz = useQuiz((state) => state.selectedQuiz);

	return (
		<section className="pb-2.5">
			<LoadingLayout isLoading={isLoading} error={error}>
				<>{!!quiz && <QuizEditForm quiz={quiz} mode={mode} />}</>
			</LoadingLayout>
		</section>
	);
};
