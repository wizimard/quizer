import type { IEditConfigComponentProps } from "@features/quiz/model/editQuizForm";
import { Box, IconButton } from "@mui/material";
import type { QuestionConfigOption } from "@shared/api/generated";
import { FormTextField } from "@shared/ui/form";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export interface IAnswerOptionProps {
	children: React.ReactNode;
	option: QuestionConfigOption;
	index: number;
	isChecked: boolean;
	onRemove(index: number): void;
}

export const AnswerOption = ({ control, name, index, children, option, isChecked, onRemove }: IEditConfigComponentProps<IAnswerOptionProps>) => {
	const handleClickDelete = () => {
		onRemove(index);
	};

	return (
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
				backgroundColor: isChecked ? "#C7FFCC" : "",
				borderRadius: "5px",
			}}
		>
			{children}
			<FormTextField control={control} name={`${name}.options.${index}.value`} label="question_create_form.answer_option.label" placeholder="question_create_form.answer_option.placeholder" />
			<IconButton sx={{ marginTop: "10px", flexShrink: 0 }} onClick={handleClickDelete}>
				<DeleteForeverIcon color={isChecked ? "error" : "inherit"} />
			</IconButton>
		</Box>
	);
};
