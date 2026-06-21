import { useGetQuiz, useQuiz } from "@entities/quiz";
import { Box } from "@mui/material";
import { Text } from "@shared/ui/text";
import { useParams } from "react-router-dom";
import { QuizToolbar } from "./ui/QuizToolbar";
import { QuizQuestionsList } from "./ui/QuizQuestionsList";
import { LoadingLayout } from "@shared/ui/layout";
import { useTranslation } from "react-i18next";

export const Quiz = () => {
	const { t } = useTranslation();

	const { id } = useParams();

	const { isLoading } = useGetQuiz(id);

	const quiz = useQuiz((state) => state.selectedQuiz);

	return (
		<LoadingLayout isLoading={isLoading}>
			<>
				{!!quiz && (
					<Box sx={{ width: "100%", minHeight: "100%", padding: "20px 40px 10px 40px", display: "flex", flexDirection: "column", gap: "10px", flexShrink: 1 }}>
						<QuizToolbar quiz={quiz} />
						<Text component="h3" sx={{ fontSize: "1.2rem" }}>
							{t("quiz.questions")}
						</Text>
						<QuizQuestionsList questions={quiz.questions} />
					</Box>
				)}
			</>
		</LoadingLayout>
	);
};
