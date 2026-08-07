import { format } from "date-fns";
import { ChevronLeft, Clock, Flag, Timer, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { TestSessionOverviewMetaItem } from "./TestSessionOverviewMetaItem";
import type { TestSessionOverview } from "@entities/test";
import { useElapsedTime } from "@shared/hooks/useElapsedTime";
import { Typography } from "@shared/ui/typography";
import { TestSessionOverviewResponseRunModeEnum } from "@shared/api/generated";

interface TestSessionOverviewHeaderProps {
	sessionOverview: TestSessionOverview;
}

export const TestSessionOverviewHeader = ({ sessionOverview }: TestSessionOverviewHeaderProps) => {
	const { t } = useTranslation();
	const { testId } = useParams();
	const duration = useElapsedTime(sessionOverview.started_at, sessionOverview.finished_at);

	const runModeLabel = sessionOverview.run_mode === TestSessionOverviewResponseRunModeEnum.Manual ? t("test_session_overview.run_mode.manual") : t("test_session_overview.run_mode.free");

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-1.5">
				<Link to={`/test-history/${testId}`} className="mb-1 inline-flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
					<ChevronLeft className="size-4" aria-hidden />
					{t("test_session_overview.back_to_history")}
				</Link>
				<Typography component="h1" className="truncate text-[1.4rem] text-foreground">
					{sessionOverview.title}
				</Typography>
				<Typography variant="body2" className="text-muted-foreground">
					{runModeLabel}
				</Typography>
			</div>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
				<TestSessionOverviewMetaItem icon={Clock} label={t("test_session_overview.meta.started_at")} value={format(sessionOverview.started_at, "dd.MM.yyyy HH:mm")} />
				<TestSessionOverviewMetaItem icon={Flag} label={t("test_session_overview.meta.finished_at")} value={format(sessionOverview.finished_at, "dd.MM.yyyy HH:mm")} />
				<TestSessionOverviewMetaItem icon={Users} label={t("test_session_overview.meta.participants")} value={String(sessionOverview.registered_users.length)} />
				<TestSessionOverviewMetaItem icon={Timer} label={t("test_session_overview.meta.duration")} value={duration} />
			</div>
		</div>
	);
};
