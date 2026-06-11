import type { IEditConfigComponentProps } from "@features/quiz/model/editQuizForm";
import { Box } from "@mui/material";
import type { QuestionConfigMultipleChoise } from "@shared/api/generated";
import { FormCheckboxField, FormTextField } from "@shared/ui/form";
import { useController, useWatch } from "react-hook-form";

export const MultipleChoiseConfig = ({ answer, options, control, name }: IEditConfigComponentProps<QuestionConfigMultipleChoise>) => {
	const { field: answerField } = useController({ control, name: `${name}.answer` });

	const answerValue: string[] = useWatch({ control, name: `${name}.answer`, defaultValue: answer }) as string[];

	const handleChangeAnswer = (id: string) => {
		const newAnswer: string[] = answerValue.includes(id) ? answerValue.filter((item: string) => item !== id) : [...answerValue, id];

		answerField.onChange(newAnswer);
	};

	return (
		<>
			{!!answer && !!options && (
				<Box component="ul" sx={{ listStyle: "none", margin: 0, padding: 0 }}>
					{options.map((option, index) => (
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
								backgroundColor: answerValue.includes(option.id) ? "#C7FFCC" : "",
								borderRadius: "5px",
							}}
						>
							<FormCheckboxField
								onChange={handleChangeAnswer.bind(this, option.id)}
								control={control}
								name={`${name}.answer`}
								sx={{ marginTop: "12px" }}
								checked={answerValue.includes(option.id)}
								color="success"
							/>
							<FormTextField control={control} name={`${name}.options.${index}.value`} label="Вариант ответа" placeholder="Введите вариант ответа" />
						</Box>
					))}
				</Box>
			)}
		</>
	);
};
