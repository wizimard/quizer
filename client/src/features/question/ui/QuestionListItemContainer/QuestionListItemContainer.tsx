import { Box } from "@mui/material";
import type { ReactNode } from "react";

interface IQuestionListItemContainer {
	children: ReactNode;
}

export const QuestionListItemContainer = ({ children }: IQuestionListItemContainer) => {
	return <Box sx={{ padding: "10px", width: "100%", backgroundColor: "#E8E8E8", borderRadius: "5px" }}>{children}</Box>;
};
