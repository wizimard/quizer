import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTestExecutionStore, type TestExecution } from "@entities/test";
import { Card, CardContent } from "@shared/ui/kit/card";
import { CenterElement } from "@shared/ui/layout";
import { Typography } from "@shared/ui/typography";

interface TestQuestionWaitingScreenProps {
	test: TestExecution;
}

const WaitingDots = () => (
	<span className="inline-flex items-center gap-1" aria-hidden>
		{[0, 150, 300].map((delay) => (
			<span key={delay} className="size-1.5 animate-bounce rounded-full bg-sky-500/70" style={{ animationDelay: `${delay}ms` }} />
		))}
	</span>
);

export const TestQuestionWaitingScreen = ({ test }: TestQuestionWaitingScreenProps) => {
	const { t } = useTranslation();
	const { currentQuestionIndex, totalQuestions } = useTestExecutionStore();

	const answeredCount = currentQuestionIndex;
	const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

	return (
		<CenterElement className="min-h-dvh bg-gradient-to-b from-sky-50/90 via-background to-background px-4 py-6 sm:py-8 dark:from-sky-950/25">
			<Card className="w-full max-w-sm border-0 shadow-lg ring-1 ring-sky-500/10">
				<CardContent className="flex flex-col items-center gap-5 px-5 py-8 text-center sm:gap-6 sm:px-6 sm:py-10">
					<div className="relative">
						<div className="absolute inset-0 animate-ping rounded-full bg-sky-400/20" />
						<div className="relative flex size-16 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-950/60">
							<LoaderCircle className="size-7 animate-spin text-sky-600 dark:text-sky-400" strokeWidth={1.75} aria-hidden />
						</div>
					</div>

					<div className="flex flex-col gap-2 px-1">
						<Typography variant="overline" className="text-sky-600 dark:text-sky-400">
							{t("test_execute.waiting.badge")}
						</Typography>
						<Typography variant="h5" align="center" className="text-foreground leading-snug">
							{t("test_execute.question_waiting.title")}
						</Typography>
						<Typography variant="body2" align="center" className="text-muted-foreground leading-relaxed">
							{test.title}
						</Typography>
					</div>

					{totalQuestions > 0 && (
						<div className="flex w-full flex-col gap-3 rounded-2xl bg-sky-50 px-5 py-4 dark:bg-sky-950/30">
							<div className="flex items-baseline justify-between gap-3">
								<Typography variant="caption" className="text-sky-700/80 dark:text-sky-300/80">
									{t("test_execute.question_waiting.progress", {
										answered: answeredCount,
										total: totalQuestions,
									})}
								</Typography>
								<Typography variant="caption" className="tabular-nums text-sky-600 dark:text-sky-400">
									{Math.round(progress)}%
								</Typography>
							</div>

							<div
								className="h-1.5 overflow-hidden rounded-full bg-sky-200/70 dark:bg-sky-900/50"
								role="progressbar"
								aria-valuenow={answeredCount}
								aria-valuemin={0}
								aria-valuemax={totalQuestions}
								aria-label={t("test_execute.question_waiting.progress", {
									answered: answeredCount,
									total: totalQuestions,
								})}
							>
								<div className="h-full rounded-full bg-sky-500 transition-[width] duration-500 ease-out dark:bg-sky-400" style={{ width: `${progress}%` }} />
							</div>
						</div>
					)}

					<Typography variant="body2" align="center" className="px-1 text-muted-foreground leading-relaxed">
						{t("test_execute.question_waiting.description")}
					</Typography>

					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<WaitingDots />
						<span>{t("test_execute.question_waiting.refreshing")}</span>
					</div>
				</CardContent>
			</Card>
		</CenterElement>
	);
};
