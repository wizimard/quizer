import { Box, colors } from "@mui/material";
import type { ReactNode } from "react";

interface IQuestionListItemContainer {
	children: ReactNode;
	isError?: boolean;
}

export const QuestionListItemContainer = ({ children, isError }: IQuestionListItemContainer) => {
	return (
		<Box sx={{ padding: "10px", width: "100%", backgroundColor: "#E8E8E8", borderRadius: "5px", borderWidth: "1px", borderStyle: "solid", borderColor: isError ? colors.red : "transparent" }}>
			{children}
		</Box>
	);
};
