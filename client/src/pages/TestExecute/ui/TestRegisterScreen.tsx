import { ClipboardList } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TestExecution } from "@entities/test";
import { TestExecutionRegisterForm } from "@features/test/test-execution-register";
import { Card, CardContent } from "@shared/ui/kit/card";
import { CenterElement } from "@shared/ui/layout";
import { Typography } from "@shared/ui/typography";

interface TestRegisterScreenProps {
	test: TestExecution;
}

export const TestRegisterScreen = ({ test }: TestRegisterScreenProps) => {
	const { t } = useTranslation();

	return (
		<CenterElement className="min-h-dvh bg-gradient-to-b from-violet-50/80 via-background to-background px-4 py-8 dark:from-violet-950/20">
			<Card className="w-full max-w-sm border-0 shadow-lg ring-1 ring-foreground/5">
				<CardContent className="flex flex-col gap-6 py-8">
					<div className="flex flex-col items-center gap-4 text-center">
						<div className="flex size-14 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-950/50">
							<ClipboardList className="size-6 text-violet-600 dark:text-violet-400" aria-hidden />
						</div>

						<div className="flex flex-col gap-1.5 px-2">
							<Typography variant="overline" className="text-violet-600 dark:text-violet-400">
								{t("test_execute.register.badge")}
							</Typography>
							<Typography variant="h5" align="center" className="text-foreground leading-snug">
								{test.title}
							</Typography>
							<Typography variant="body2" align="center" className="text-muted-foreground leading-relaxed">
								{t("test_execute.register.description")}
							</Typography>
						</div>
					</div>

					<TestExecutionRegisterForm testId={test.id} />
				</CardContent>
			</Card>
		</CenterElement>
	);
};
