import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { QuestionViewConfig } from "@entities/question/ui/QuestionViewConfig";
import type { Question } from "@entities/question";
import { Typography } from "@shared/ui/typography";

interface ActiveQuestionViewProps {
	question: Question;
	questionIndex: number;
	totalQuestions: number;
	action: ReactNode;
}

export const ActiveQuestionView = ({ question, questionIndex, totalQuestions, action }: ActiveQuestionViewProps) => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-4 rounded-xl bg-card px-6 py-5 ring-1 ring-foreground/10">
			<div className="flex items-center justify-between gap-3">
				<Typography variant="caption" className="tabular-nums">
					{t("test_manage.current_question.progress", {
						current: questionIndex,
						total: totalQuestions,
					})}
				</Typography>
				{action}
			</div>

			<div className="flex flex-col gap-4">
				<Typography variant="subtitle1" className="text-foreground leading-relaxed">
					{question.description}
				</Typography>
				<QuestionViewConfig config={question.config} />
			</div>
		</div>
	);
};
