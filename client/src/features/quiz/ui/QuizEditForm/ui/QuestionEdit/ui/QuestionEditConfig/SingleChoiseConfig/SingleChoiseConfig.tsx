import type { IEditConfigComponentProps } from "@features/quiz/model/editQuizForm";
import { Box } from "@mui/material";
import type { QuestionConfigSingleChoise } from "@shared/api/generated";
import { FormRadioField, FormTextField } from "@shared/ui/form";
import { useController, useWatch } from "react-hook-form";

export const SingleChoiseConfig = ({ options, control, name }: IEditConfigComponentProps<QuestionConfigSingleChoise>) => {
	const { field: answerField } = useController({ control, name: `${name}.answer` });

	const answer: string = useWatch({ control, name: `${name}.answer` }) as string;

	const handleChangeAnswer = (id: string) => {
		answerField.onChange(id);
	};

	return (
		<Box component="ul" sx={{ listStyle: "none", margin: 0, padding: 0 }}>
			{!!options &&
				options.map((option, index) => (
					<Box
						component="li"
						key={option.id}
						sx={{
							listStyle: "none",
							margin: 0,
							padding: "5px",
							display: "flex",
							gap: "10px",
							alignItems: "flex-start",
							backgroundColor: answer === option.id ? "#C7FFCC" : "",
							borderRadius: "5px",
						}}
					>
						<FormRadioField
							onChange={handleChangeAnswer.bind(this, option.id)}
							control={control}
							name={`${name}.answer`}
							sx={{ marginTop: "12px" }}
							checked={answer === option.id}
							color="success"
						/>
						<FormTextField
							control={control}
							name={`${name}.options.${index}.value`}
							label="question_create_form.answer_option.label"
							placeholder="question_create_form.answer_option.placeholder"
						/>
					</Box>
				))}
		</Box>
	);
};
