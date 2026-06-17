import type { IEditConfigComponentProps } from "@features/quiz/model/editQuizForm";
import { Box, Button } from "@mui/material";
import type { QuestionConfigMultipleChoise } from "@shared/api/generated";
import { FormCheckboxField } from "@shared/ui/form";
import { useController, useFieldArray, useWatch } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import { Text } from "@shared/ui/text";
import { useTranslation } from "react-i18next";
import { AnswerOption } from "../AnswerOption";
import { generateOptions } from "@entities/question";

export const MultipleChoiseConfig = ({ answer, options, control, name }: IEditConfigComponentProps<QuestionConfigMultipleChoise>) => {
	const { t } = useTranslation();

	const { field: answerField } = useController({ control, name: `${name}.answer` });

	const { append, remove } = useFieldArray({ control, name: `${name}.options` });

	const answerValue: string[] = useWatch({ control, name: `${name}.answer`, defaultValue: answer }) as string[];

	const handleChangeAnswer = (id: string) => {
		const newAnswer: string[] = answerValue.includes(id) ? answerValue.filter((item: string) => item !== id) : [...answerValue, id];

		answerField.onChange(newAnswer);
	};

	const handleAppend = () => {
		append(generateOptions(1));
	};

	return (
		<>
			{!!answer && !!options && (
				<>
					<Box component="ul" sx={{ listStyle: "none", margin: 0, padding: 0 }}>
						{options.map((option, index) => (
							<AnswerOption control={control} name={name} index={index} key={option.id} option={option} isChecked={answerValue.includes(option.id)} onRemove={remove}>
								<FormCheckboxField onChange={handleChangeAnswer.bind(this, option.id)} sx={{ marginTop: "12px" }} checked={answerValue.includes(option.id)} color="success" />
							</AnswerOption>
						))}
					</Box>
					{options.length < 8 && (
						<Button
							sx={{ width: "100%", paddingLeft: "14px", marginTop: "10px", display: "flex", alignItems: "center", gap: "25px", textAlign: "start", justifyContent: "flex-start" }}
							onClick={handleAppend}
						>
							<AddIcon />
							<Text>{t("question_create_form.answer_option.add")}</Text>
						</Button>
					)}
				</>
			)}
		</>
	);
};
