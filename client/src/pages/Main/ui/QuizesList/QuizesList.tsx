import { useQuiz } from "@entities/quiz";
import { QuizCard } from "@features/quiz";
import type { QuizResponse } from "@shared/api/generated";

export const QuizesList = () => {
	const quizes: QuizResponse[] = useQuiz((state) => state.quizes);

	return (
		<div className="flex h-full w-full flex-wrap content-start gap-5">
			{!!quizes && quizes.map((quiz) => <QuizCard key={quiz.id} {...quiz} />)}
		</div>
	);
};
