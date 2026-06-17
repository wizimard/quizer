import { Box, Button } from "@mui/material";
import type { UseFieldArrayAppend } from "react-hook-form";
import { v4 as uuidV4 } from "uuid";
import AddIcon from "@mui/icons-material/Add";
import type { IEditQuiz, TQuestionForm } from "@features/quiz/model/editQuizForm";
import { useTranslation } from "react-i18next";

export interface IQuestionAdd {
	appendQuestion: UseFieldArrayAppend<IEditQuiz, "questions">;
}
export const QuestionAdd = ({ appendQuestion }: IQuestionAdd) => {
	const { t } = useTranslation();

	const handleClick = () => {
		const id: string = "new_" + uuidV4();
		const question: TQuestionForm = {
			id,
			questionId: id,
			description: "",
			config: null,
		};

		appendQuestion(question);
	};

	return (
		<Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
			<Button onClick={handleClick} variant="contained" sx={{ backgroundColor: "green", padding: "10px 0", width: "200px" }}>
				<AddIcon fontSize="small" sx={{ marginTop: "-2px", marginRight: "5px" }} />
				{t("quiz_create.form.add_question")}
			</Button>
		</Box>
	);
};
