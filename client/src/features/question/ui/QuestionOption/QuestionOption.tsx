import { Box } from "@mui/material";
import type { QuestionConfigOption } from "@shared/api/generated";
import { Text } from "@shared/ui/text";

export interface IQuestionOptionProps extends QuestionConfigOption {
	checked?: boolean;
	disabled?: boolean;
	onClick?: (id: string) => void;
}

export const QuestionOption = ({ id, value, checked, disabled, onClick }: IQuestionOptionProps) => {
	const handleClick = () => {
		if (!onClick) {
			return;
		}
		onClick(id);
	};

	return (
		<Box
			component="button"
			disabled={disabled}
			onClick={handleClick}
			sx={{
				width: "100%",
				padding: "5px 10px",
				textAlign: "start",
				outline: "none",
				borderWidth: "1px",
				borderStyle: "solid",
				borderColor: checked ? "#177D00" : "#B8B8B8",
				borderRadius: "10px",
				backgroundColor: checked ? "#C7FFCC" : "",
			}}
		>
			<Text>{value}</Text>
		</Box>
	);
};
