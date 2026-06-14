import { useQuiz } from "@entities/quiz";
import { QuizCard } from "@features/quiz";
import { Box } from "@mui/material";
import type { QuizResponse } from "@shared/api/generated";

export const QuizesList = () => {
	const quizes: QuizResponse[] = useQuiz((state) => state.quizes);

	return (
		<Box sx={{ width: "100%", height: "100%", display: "flex", gap: "20px", flexWrap: "wrap", alignContent: "flex-start" }}>
			{!!quizes && quizes.map((quiz) => <QuizCard key={quiz.id} {...quiz} />)}
		</Box>
	);
};
