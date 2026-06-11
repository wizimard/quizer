import { Box, Button } from "@mui/material";
import type { UseFieldArrayAppend } from "react-hook-form";
import { v4 as uuidV4 } from "uuid";
import AddIcon from "@mui/icons-material/Add";
import type { IEditQuiz, TQuestionForm } from "@features/quiz/model/editQuizForm";

export interface IQuestionAdd {
	appendQuestion: UseFieldArrayAppend<IEditQuiz, "questions">;
}
export const QuestionAdd = ({ appendQuestion }: IQuestionAdd) => {
	const handleClick = () => {
		const question: TQuestionForm = {
			id: "new_" + uuidV4(),
			description: "",
			config: null,
		};

		appendQuestion(question);
	};

	return (
		<Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
			<Button onClick={handleClick} variant="contained" sx={{ backgroundColor: "green", padding: "10px 0", width: "200px" }}>
				<AddIcon fontSize="small" sx={{ marginTop: "-2px", marginRight: "5px" }} />
				Добавить вопрос
			</Button>
		</Box>
	);
};
