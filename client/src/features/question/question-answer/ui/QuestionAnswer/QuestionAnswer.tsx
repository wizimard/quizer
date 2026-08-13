import { useTranslation } from "react-i18next";
import type { Control } from "react-hook-form";
import type { QuestionAnswerFormValues } from "../../model/question-answer-form";
import { QUESTION_ANSWER_COMPONENTS, type SupportedQuestionAnswerType } from "./question-answer.map";
import { QUESTION_TYPES } from "@entities/question";
import { Typography } from "@shared/ui/typography";
import type { QuestionExecuteConfig } from "@shared/api/generated";

interface QuestionAnswerProps {
	config: QuestionExecuteConfig;
	control: Control<QuestionAnswerFormValues>;
}

const isSupportedType = (type: string): type is SupportedQuestionAnswerType => type in QUESTION_ANSWER_COMPONENTS;

export const QuestionAnswer = ({ config, control }: QuestionAnswerProps) => {
	const { t } = useTranslation();

	if (!isSupportedType(config.type)) {
		return (
			<Typography variant="body2" className="text-muted-foreground">
				{t("errors.unknown_question_type")}
			</Typography>
		);
	}

	switch (config.type) {
		case QUESTION_TYPES.INPUT: {
			const Component = QUESTION_ANSWER_COMPONENTS[QUESTION_TYPES.INPUT];

			return <Component {...config} control={control} />;
		}
		case QUESTION_TYPES.SIGNLE_CHOICE: {
			const Component = QUESTION_ANSWER_COMPONENTS[QUESTION_TYPES.SIGNLE_CHOICE];

			return <Component {...config} control={control} />;
		}
		case QUESTION_TYPES.MULTIPLE_CHOICE: {
			const Component = QUESTION_ANSWER_COMPONENTS[QUESTION_TYPES.MULTIPLE_CHOICE];

			return <Component {...config} control={control} />;
		}
	}

	return null;
};
