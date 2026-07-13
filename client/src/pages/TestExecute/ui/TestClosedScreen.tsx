import { Hourglass } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TestExecution } from "@entities/test";
import { Card, CardContent } from "@shared/ui/kit/card";
import { CenterElement } from "@shared/ui/layout";
import { Typography } from "@shared/ui/typography";

interface TestClosedScreenProps {
	test: TestExecution;
}

const WaitingDots = () => (
	<span className="inline-flex items-center gap-1" aria-hidden>
		{[0, 150, 300].map((delay) => (
			<span key={delay} className="size-1.5 animate-bounce rounded-full bg-amber-500/70" style={{ animationDelay: `${delay}ms` }} />
		))}
	</span>
);

export const TestClosedScreen = ({ test }: TestClosedScreenProps) => {
	const { t } = useTranslation();

	return (
		<CenterElement className="min-h-dvh bg-gradient-to-b from-amber-50/80 via-background to-background px-4 py-8 dark:from-amber-950/20">
			<Card className="w-full max-w-sm border-0 shadow-lg ring-1 ring-foreground/5">
				<CardContent className="flex flex-col items-center gap-6 py-10 text-center">
					<div className="relative">
						<div className="absolute inset-0 animate-ping rounded-full bg-amber-400/20" />
						<div className="relative flex size-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/50">
							<Hourglass className="size-7 animate-pulse text-amber-600 dark:text-amber-400" aria-hidden />
						</div>
					</div>

					<div className="flex flex-col gap-2 px-2">
						<Typography variant="overline" className="text-amber-600 dark:text-amber-400">
							{t("test_execute.waiting.badge")}
						</Typography>
						<Typography variant="h5" align="center" className="text-foreground leading-snug">
							{test.title}
						</Typography>
					</div>

					<div className="flex flex-col gap-3 px-2">
						<Typography variant="subtitle1" align="center" className="text-foreground">
							{t("test_execute.waiting.title")}
						</Typography>
						<Typography variant="body2" align="center" className="text-muted-foreground leading-relaxed">
							{t("test_execute.waiting.description")}
						</Typography>
					</div>

					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<WaitingDots />
						<span>{t("test_execute.waiting.refreshing")}</span>
					</div>
				</CardContent>
			</Card>
		</CenterElement>
	);
};
