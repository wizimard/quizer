import { QuizCard, useGetQuizes } from "@entities/quiz";

export const QuizesList = () => {
	const { quizes } = useGetQuizes();

	return <div className="flex h-full w-full flex-wrap content-start gap-5">{!!quizes && quizes.map((quiz) => <QuizCard key={quiz.id} {...quiz} />)}</div>;
};
