import { Question, QuestionListItemContainer } from "@features/question";
import { QUESTION_MODES } from "@features/question/ui/Question/Question.types";
import { Box } from "@mui/material";
import type { QuestionRequest } from "@shared/api/generated";
import { Text } from "@shared/ui/text";

export interface IQuizQuestionsListProps {
	questions: QuestionRequest[];
}

export const QuizQuestionsList = ({ questions }: IQuizQuestionsListProps) => {
	return (
		<Box component="ul" sx={{ width: "100%", height: "100%", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "15px" }}>
			{questions.map((question, index) => (
				<Box key={question.id} component="li" sx={{ width: "100%", listStyle: "none", display: "flex", gap: "10px" }}>
					<Text sx={{ width: "28px" }} align="right">
						{index + 1}
					</Text>
					<QuestionListItemContainer>
						<Question question={question} mode={QUESTION_MODES.VIEW} />
					</QuestionListItemContainer>
				</Box>
			))}
		</Box>
	);
};
