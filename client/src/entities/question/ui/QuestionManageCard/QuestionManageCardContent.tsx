import { QuestionViewConfig } from "../QuestionViewConfig";
import { Typography } from "@shared/ui/typography";
import type { Question } from "@entities/question";

export const QuestionManageCardContent = ({ description, config }: Question) => {
	return (
		<>
			<Typography className="pr-5 pb-5">{description}</Typography>
			<QuestionViewConfig config={config} />
		</>
	);
};
