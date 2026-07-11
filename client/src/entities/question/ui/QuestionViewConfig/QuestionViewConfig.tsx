import { QUESTION_CONFIG_COMPONENTS } from "./question-view-config.map";
import type { QuestionRequestConfig } from "@shared/api/generated";

export interface QuestionViewConfigProps {
	config: QuestionRequestConfig;
}

export const QuestionViewConfig = ({ config }: QuestionViewConfigProps) => {
	const Component = QUESTION_CONFIG_COMPONENTS[config.type as keyof typeof QUESTION_CONFIG_COMPONENTS] as React.ComponentType<QuestionRequestConfig> | undefined;

	return <div>{!!Component && <Component {...config} />}</div>;
};
