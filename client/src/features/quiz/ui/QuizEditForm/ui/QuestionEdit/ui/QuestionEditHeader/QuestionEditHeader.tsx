import { Box, IconButton } from "@mui/material";
import type { UseFieldArrayRemove } from "react-hook-form";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export interface IQuestionEditHeaderProps {
	index: number;
	isLast: boolean;
	changeQuestionOrder(from: number, to: number): void;
	removeQuestion: UseFieldArrayRemove;
}

export const QuestionEditHeader = ({ index, isLast, removeQuestion, changeQuestionOrder }: IQuestionEditHeaderProps) => {
	const handleDeleteQuestion = () => {
		removeQuestion(index);
	};

	const handleOrderUp = () => {
		changeQuestionOrder(index, index - 1);
	};

	const handleOrderDown = () => {
		changeQuestionOrder(index, index + 1);
	};

	return (
		<Box sx={{ width: "100%" }}>
			{index > 0 && (
				<IconButton aria-label="move question up" onClick={handleOrderUp}>
					<KeyboardArrowUpIcon />
				</IconButton>
			)}
			{!isLast && (
				<IconButton aria-label="move question down" onClick={handleOrderDown}>
					<KeyboardArrowDownIcon />
				</IconButton>
			)}
			<IconButton aria-label="delete" sx={{ float: "right" }} onClick={handleDeleteQuestion}>
				<DeleteForeverIcon />
			</IconButton>
		</Box>
	);
};
