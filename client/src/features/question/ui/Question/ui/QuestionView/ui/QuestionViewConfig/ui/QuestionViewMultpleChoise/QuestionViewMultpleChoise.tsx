import { QuestionOption } from "@features/question/ui/QuestionOption";
import { Box } from "@mui/material";
import type { QuestionConfigMultipleChoise } from "@shared/api/generated";

export const QuestionViewMultpleChoise = ({ options, answer }: QuestionConfigMultipleChoise) => {
	return (
		<Box component="ul" sx={{ width: "100%", listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
			{options.map((option, index) => (
				<Box component="li" key={option.id} sx={{ width: "100%", listStyle: "none", padding: 0, margin: 0 }}>
					<QuestionOption {...option} value={`${index + 1}. ${option.value}`} disabled={true} checked={answer.includes(option.id)} />
				</Box>
			))}
		</Box>
	);
};
