import { useGetQuiz, useQuiz } from "@entities/quiz";
import { Box } from "@mui/material";
import { Text } from "@shared/ui/text";
import { useParams } from "react-router-dom";
import { QuizToolbar } from "./ui/QuizToolbar";
import { QuizQuestionsList } from "./ui/QuizQuestionsList";

export const Quiz = () => {
	const { id } = useParams();

	const { isLoading } = useGetQuiz(id);

	const quiz = useQuiz((state) => state.selectedQuiz);

	return (
		<>
			{isLoading ? (
				<>Loading...</>
			) : (
				<>
					{!!quiz && (
						<Box sx={{ width: "100%", minHeight: "100%", padding: "20px 40px 10px 40px", display: "flex", flexDirection: "column", gap: "10px", flexShrink: 1 }}>
							<QuizToolbar quiz={quiz} />
							<Text component="h3" sx={{ fontSize: "1.2rem" }}>
								Вопросы
							</Text>
							<QuizQuestionsList questions={quiz.questions} />
						</Box>
					)}
				</>
			)}
		</>
	);
};
