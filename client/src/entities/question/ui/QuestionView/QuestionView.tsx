import { Text } from "@shared/ui/text";
import { QuestionViewConfig } from "./ui/QuestionViewConfig";
import type { QuestionRequest } from "@shared/api/generated";

export interface IQuestionViewProps {
	question: QuestionRequest;
}

export const QuestionView = ({ question: { description, config } }: IQuestionViewProps) => {
	return (
		<div className="flex w-full flex-col gap-2.5">
			<Text>{description}</Text>
			<QuestionViewConfig config={config} />
		</div>
	);
};
