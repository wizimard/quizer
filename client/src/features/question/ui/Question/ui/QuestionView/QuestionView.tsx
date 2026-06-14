import { Box } from "@mui/material";
import { Text } from "@shared/ui/text";
import { QuestionViewConfig } from "./ui/QuestionViewConfig";
import type { QuestionRequest } from "@shared/api/generated";

export const QuestionView = ({ description, config }: QuestionRequest) => {
	return (
		<Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
			<Text>{description}</Text>
			<QuestionViewConfig config={config} />
		</Box>
	);
};
