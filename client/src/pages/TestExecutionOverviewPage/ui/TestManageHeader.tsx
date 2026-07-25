import { useTranslation } from "react-i18next";
import { StopTest } from "@features/test/stop-test";
import type { TestExecutionOverview } from "@entities/test";
import { useElapsedTime } from "@shared/hooks/useElapsedTime";
import { ElapsedTimer } from "@shared/ui/timer";
import { Typography } from "@shared/ui/typography";

interface TestManageHeaderProps {
	testOverview: TestExecutionOverview;
}

export const TestManageHeader = ({ testOverview }: TestManageHeaderProps) => {
	const { t } = useTranslation();

	const isRunning = !testOverview.finished_at;
	const elapsed = useElapsedTime(testOverview.started_from, testOverview.finished_at);

	return (
		<div className="flex w-full flex-wrap items-center gap-3 gap-y-4">
			<div className="min-w-0 flex-1">
				<Typography component="h1" className="truncate text-[1.4rem] text-foreground">
					{testOverview.title}
				</Typography>
			</div>

			<div className="ml-auto flex items-center gap-3">
				<ElapsedTimer elapsed={elapsed} isRunning={isRunning} title={t("test_manage.timer.label")} />
				{isRunning && <StopTest test={{ id: testOverview.id, isOpen: true }} />}
			</div>
		</div>
	);
};
