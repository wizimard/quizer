import { QuestionOption } from "@features/question/ui/QuestionOption";
import { Box } from "@mui/material";
import type { QuestionConfigSingleChoise } from "@shared/api/generated";

export const QuestionViewSingleChoise = ({ answer, options }: QuestionConfigSingleChoise) => {
	return (
		<Box component="ul" sx={{ width: "100%", listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
			{options.map((option, index) => (
				<Box component="li" key={option.id} sx={{ width: "100%", listStyle: "none", padding: 0, margin: 0 }}>
					<QuestionOption {...option} value={`${index + 1}. ${option.value}`} disabled={true} checked={option.id === answer} />
				</Box>
			))}
		</Box>
	);
};
