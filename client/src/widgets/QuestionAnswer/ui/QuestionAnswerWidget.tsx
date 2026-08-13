import { useTranslation } from "react-i18next";

import { QuestionAnswerHeader } from "./QuestionAnswerHeader";

import { QuestionAnswerForm } from "@features/question/question-answer";
import type { QuestionExecution } from "@entities/question/model/question-execution.interface";
import type { TestExecution } from "@entities/test";

import { resolveApiAssetUrl } from "@shared/lib/resolveApiAssetUrl";
import { Typography } from "@shared/ui/typography";

interface QuestionAnswerWidgetProps {
	test: TestExecution;
	question: QuestionExecution;
}

export const QuestionAnswerWidget = ({ test, question }: QuestionAnswerWidgetProps) => {
	const { t } = useTranslation();
	const imageUrl = resolveApiAssetUrl(question.image);

	return (
		<div className="flex min-h-dvh flex-col bg-gradient-to-b from-emerald-50/80 via-background to-background dark:from-emerald-950/20">
			<QuestionAnswerHeader test={test} />

			<main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-6">
				<section className="flex flex-col gap-2">
					<Typography variant="overline" className="text-emerald-700 dark:text-emerald-400">
						{test.title}
					</Typography>

					<Typography variant="subtitle1" className="text-foreground leading-relaxed">
						{question.description}
					</Typography>

					{imageUrl ? <img src={imageUrl} alt={t("question_form.image.label")} className="max-h-56 w-full object-contain" /> : null}
				</section>

				<QuestionAnswerForm question={question} />
			</main>
		</div>
	);
};
