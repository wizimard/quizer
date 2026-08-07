import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { ChevronRight, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetTestHistory } from "@entities/test";
import { LoadingLayout } from "@shared/ui/layout";
import { DotSeparator } from "@shared/ui/separator";
import { Typography } from "@shared/ui/typography";
import { TestLaunchResponseRunModeEnum } from "@shared/api/generated";

export const TestHistory = () => {
	const { t } = useTranslation();
	const { testId } = useParams();
	const { data, isLoading, error } = useGetTestHistory(testId as string);

	const title = data?.[0]?.testTitle ?? "";

	return (
		<LoadingLayout isLoading={isLoading} error={error}>
			{!!data && (
				<div className="flex min-h-a w-full shrink flex-col gap-4 px-10 pt-5 pb-8">
					<div className="flex flex-col gap-1">
						<Typography component="h1" className="text-[1.4rem] text-foreground">
							{t("test_history.title", { title })}
						</Typography>
						<Typography variant="body2" className="text-muted-foreground">
							{t("test_history.launches_count", { count: data.length })}
						</Typography>
					</div>

					{data.length === 0 ? (
						<Typography variant="body2" className="text-muted-foreground">
							{t("test_history.empty")}
						</Typography>
					) : (
						<ul className="flex flex-col gap-2">
							{data.map((launch) => (
								<li key={launch.sessionId}>
									<Link
										to={`/test-history/${testId}/${launch.sessionId}`}
										className="group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-foreground ring-1 ring-foreground/10 transition-colors hover:bg-muted/50"
									>
										<div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
											<span className="font-medium text-foreground">{format(launch.startedAt, "dd.MM.yyyy HH:mm")}</span>
											<DotSeparator />
											<span className="inline-block w-18 shrink-0">
												{t(launch.runMode === TestLaunchResponseRunModeEnum.Manual ? "test_history.run_mode.manual" : "test_history.run_mode.free")}
											</span>
											<DotSeparator />
											<span className="inline-flex items-center gap-1">
												<Users className="size-3.5 shrink-0" aria-hidden />
												{t("test_history.participants", { count: launch.userRegisteredCount })}
											</span>
										</div>
										<ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden />
									</Link>
								</li>
							))}
						</ul>
					)}
				</div>
			)}
		</LoadingLayout>
	);
};
