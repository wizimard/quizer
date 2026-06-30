import { useGetQuiz } from "@entities/quiz";
import { EditQuizFormModes, QuizEditForm } from "@features/quiz/quiz-edit";
import { LoadingLayout } from "@shared/ui/layout";
import { useParams } from "react-router-dom";
import { QUIZ_NEW_ID } from "@shared/constant";

export const QuizEditor = () => {
	const { id } = useParams();

	const mode = id === QUIZ_NEW_ID ? EditQuizFormModes.CREATE : EditQuizFormModes.UPDATE;

	const { isLoading, error, quiz } = useGetQuiz(id);

	return (
		<section className="pb-2.5">
			<LoadingLayout isLoading={isLoading} error={error}>
				<>{!!quiz && <QuizEditForm quiz={quiz} mode={mode} />}</>
			</LoadingLayout>
		</section>
	);
};
