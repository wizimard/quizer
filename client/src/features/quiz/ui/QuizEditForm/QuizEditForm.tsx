import { Box, Button, ButtonGroup } from "@mui/material";
import { FormTextField } from "@shared/ui/form";
import { Text } from "@shared/ui/text";
import { QuestionAdd } from "./ui/QuestionAdd/QuestionAdd";
import { useEditQuizForm } from "@features/quiz/hooks/useEditQuizForm";
import { QuestionEdit } from "./ui/QuestionEdit/QuestionEdit";
import type { useEditQuizFormModes } from "@features/quiz/hooks/useEditQuizForm.types";
import type { QuizResponse } from "@shared/api/generated";
import { useTranslation } from "react-i18next";

export interface IQuizEditFormProps {
	quiz: QuizResponse;
	mode: useEditQuizFormModes;
}

export const QuizEditForm = ({ quiz, mode }: IQuizEditFormProps) => {
	const { t } = useTranslation();

	const { control, fieldsQuestions, appendQuestion, removeQuestion, changeQuestionType, changeQuestionOrder, submitHandler, isSubmitting, isDirty } = useEditQuizForm(quiz, mode);

	return (
		<Box component="form" onSubmit={submitHandler} sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
			<Box sx={{ width: "100%", padding: "10px 20px", display: "flex", justifyContent: "flex-end" }}>
				<ButtonGroup variant="outlined" aria-label="Loading button group">
					<Button type="submit" loading={isSubmitting} disabled={!isDirty}>
						{t("common.button_save")}
					</Button>
					<Button>{t("common.button_cancel")}</Button>
				</ButtonGroup>
			</Box>
			<Box component="fieldset" disabled={isSubmitting} sx={{ width: "600px", border: "none", padding: 0, margin: 0 }}>
				<FormTextField control={control} name="title" placeholder="quiz_create.form.fields.title.placeholder" label="quiz_create.form.fields.title.label" />
				<Text variant="h5" sx={{ padding: "10px 0" }}>
					{t("quiz.questions")}
				</Text>
				{!!fieldsQuestions.length && (
					<Box component="ul" sx={{ listStyle: "none", margin: 0, padding: "0 0 20px 0", display: "flex", flexDirection: "column", gap: "20px" }}>
						{fieldsQuestions.map((question, index) => (
							<QuestionEdit
								key={question.id}
								control={control}
								index={index}
								isLast={index + 1 === fieldsQuestions.length}
								removeQuestion={removeQuestion}
								changeQuestionType={changeQuestionType}
								changeQuestionOrder={changeQuestionOrder}
							></QuestionEdit>
						))}
					</Box>
				)}
				<QuestionAdd appendQuestion={appendQuestion} />
			</Box>
		</Box>
	);
};
