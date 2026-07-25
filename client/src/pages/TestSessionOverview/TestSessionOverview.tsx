import { useParams } from "react-router-dom";
import { TestSessionOverviewHeader } from "./ui/TestSessionOverviewHeader";
import { TestSessionOverviewParticipants } from "./ui/TestSessionOverviewParticipants";
import { useGetTestSessionOverview } from "@entities/test";
import { Separator } from "@shared/ui/kit/separator";
import { LoadingLayout } from "@shared/ui/layout";

export const TestSessionOverview = () => {
	const { testId, sessionId } = useParams();
	const { data, isLoading, error } = useGetTestSessionOverview(testId as string, sessionId as string);

	return (
		<LoadingLayout isLoading={isLoading} error={error}>
			{!!data && (
				<div className="flex min-h-a w-full shrink flex-col gap-4 bg-gradient-to-b from-muted/40 via-background to-background px-10 pt-5 pb-8">
					<TestSessionOverviewHeader sessionOverview={data} />
					<Separator />
					<TestSessionOverviewParticipants sessionOverview={data} />
				</div>
			)}
		</LoadingLayout>
	);
};
