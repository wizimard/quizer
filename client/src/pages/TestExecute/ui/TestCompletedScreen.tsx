import { CircleCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTestExecutionStore, type TestExecution } from "@entities/test";
import { Card, CardContent } from "@shared/ui/kit/card";
import { CenterElement } from "@shared/ui/layout";
import { Typography } from "@shared/ui/typography";

interface TestCompletedScreenProps {
	test: TestExecution;
}

export const TestCompletedScreen = ({ test }: TestCompletedScreenProps) => {
	const { t } = useTranslation();
	const { user, totalQuestions } = useTestExecutionStore();

	const userName = user ? [user.first_name, user.last_name].filter(Boolean).join(" ") : null;

	return (
		<CenterElement className="min-h-dvh bg-gradient-to-b from-emerald-50/90 via-background to-background px-4 py-8 dark:from-emerald-950/25">
			<Card className="w-full max-w-sm border-0 shadow-lg ring-1 ring-emerald-500/10">
				<CardContent className="flex flex-col items-center gap-6 py-10 text-center">
					<div className="relative">
						<div className="absolute inset-0 scale-125 rounded-full bg-emerald-400/15 blur-md" />
						<div className="relative flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60">
							<CircleCheck className="size-8 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} aria-hidden />
						</div>
					</div>

					<div className="flex flex-col gap-2 px-2">
						<Typography variant="overline" className="text-emerald-600 dark:text-emerald-400">
							{t("test_execute.completed.badge")}
						</Typography>
						<Typography variant="h5" align="center" className="text-foreground leading-snug">
							{t("test_execute.completed.title")}
						</Typography>
						<Typography variant="body2" align="center" className="text-muted-foreground leading-relaxed">
							{test.title}
						</Typography>
					</div>

					{totalQuestions > 0 && (
						<div className="flex w-full flex-col items-center gap-1 rounded-2xl bg-emerald-50 px-6 py-4 dark:bg-emerald-950/30">
							<Typography variant="h4" className="text-emerald-700 dark:text-emerald-300">
								{totalQuestions}
							</Typography>
							<Typography variant="caption" className="text-emerald-600/80 dark:text-emerald-400/80">
								{t("test_execute.completed.questions_answered")}
							</Typography>
						</div>
					)}

					<div className="flex flex-col gap-2 px-2">
						<Typography variant="subtitle1" align="center" className="text-foreground">
							{userName ? t("test_execute.completed.thank_you_named", { name: userName }) : t("test_execute.completed.thank_you")}
						</Typography>
						<Typography variant="body2" align="center" className="text-muted-foreground leading-relaxed whitespace-break-spaces break-words">
							{t("test_execute.completed.description")}
						</Typography>
					</div>
				</CardContent>
			</Card>
		</CenterElement>
	);
};
