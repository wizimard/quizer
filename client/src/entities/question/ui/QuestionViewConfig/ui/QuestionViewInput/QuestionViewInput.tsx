import type { QuestionConfigInput } from "@shared/api/generated";
import { Typography } from "@shared/ui/typography";

export const QuestionViewInput = ({ answer, ignore_case }: QuestionConfigInput) => {
	return (
		<Typography>
			Ответ: {answer} ({ignore_case ? "без учета регистра" : "с учетом регистра"})
		</Typography>
	);
};
