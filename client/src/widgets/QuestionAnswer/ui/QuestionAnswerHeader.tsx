import { useTranslation } from "react-i18next";

import { useTestExecutionStore, type TestExecution } from "@entities/test";

import { useElapsedTime } from "@shared/hooks/useElapsedTime";
import { ElapsedTimer } from "@shared/ui/timer";
import { Typography } from "@shared/ui/typography";

export interface QuestionAnswerHeaderProps {
	test: TestExecution;
}

export const QuestionAnswerHeader = ({ test }: QuestionAnswerHeaderProps) => {
	const { t } = useTranslation();

	const { currentQuestionIndex, totalQuestions } = useTestExecutionStore();

	const isRunning = test.isOpen;
	const elapsed = useElapsedTime(new Date(test.openDate ?? 0));

	const currentAnswerNumber = currentQuestionIndex;
	const progress = totalQuestions > 0 ? (currentAnswerNumber / totalQuestions) * 100 : 0;

	return (
		<header className="relative shrink-0 px-4 py-3">
			<div className="mx-auto flex h-10 w-full max-w-lg items-center justify-between">
				<Typography variant="caption" className="tabular-nums text-emerald-700 dark:text-emerald-400">
					{t("test_execute.question.progress", { current: currentAnswerNumber, total: totalQuestions })}
				</Typography>

				<ElapsedTimer elapsed={elapsed} isRunning={isRunning} title={t("test_manage.timer.label")} />
			</div>

			<div
				className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-100/80 dark:bg-emerald-900/30"
				role="progressbar"
				aria-valuenow={currentAnswerNumber}
				aria-valuemin={1}
				aria-valuemax={totalQuestions}
				aria-label={t("test_execute.question.progress", { current: currentAnswerNumber + 1, total: totalQuestions })}
			>
				<div className="h-full bg-emerald-500 transition-[width] duration-300 ease-out dark:bg-emerald-400" style={{ width: `${progress}%` }} />
			</div>
		</header>
	);
};
