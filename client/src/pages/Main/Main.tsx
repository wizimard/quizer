import { useGetQuizes, useQuiz } from "@entities/quiz";
import { QuizCard } from "@features/quiz";
import { Box } from "@mui/material";
import type { QuizResponse } from "@shared/api/generated";
import { Text } from "@shared/ui/text";

export const Main = () => {
	const { isLoading, error } = useGetQuizes();

	const quizes: QuizResponse[] = useQuiz((state) => state.quizes);

	return (
		<>
			{isLoading ? (
				<span>Loading...</span>
			) : error ? (
				<span>{error.message}</span>
			) : (
				<Box sx={{ width: "100%", height: "100%", padding: "10px 20px", display: "flex", flexDirection: "column", gap: "20px" }}>
					<Text variant="h4">Ваши викторины</Text>
					{!!quizes && quizes.map((quiz) => <QuizCard key={quiz.id} {...quiz} />)}
				</Box>
			)}
		</>
	);
};
