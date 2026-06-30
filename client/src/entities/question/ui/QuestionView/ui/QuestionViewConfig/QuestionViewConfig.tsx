import type { QuestionRequestConfig } from "@shared/api/generated";
import { QUESTION_CONFIG_COMPONENTS } from "./question-view-config.map";

export interface IQuestionViewConfigProps {
	config: QuestionRequestConfig;
}

export const QuestionViewConfig = ({ config }: IQuestionViewConfigProps) => {
	const Component = QUESTION_CONFIG_COMPONENTS[config.type];

	return <div>{!!Component && <Component {...config} />}</div>;
};
