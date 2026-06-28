import { Text } from "@shared/ui/text";
import { QuestionViewConfig } from "./ui/QuestionViewConfig";
import type { QuestionRequest } from "@shared/api/generated";

export const QuestionView = ({ description, config }: QuestionRequest) => {
	return (
		<div className="flex w-full flex-col gap-2.5">
			<Text>{description}</Text>
			<QuestionViewConfig config={config} />
		</div>
	);
};
