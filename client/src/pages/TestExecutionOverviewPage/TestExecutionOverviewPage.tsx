import { useParams } from "react-router-dom";
import { TestManageHeader } from "./ui/TestManageHeader";
import { TestManageParticipants } from "./ui/TestManageParticipants";
import { useGetTestOverview } from "@entities/test";
import { useTestExecutionOverviewSocket } from "./hooks/useTestExecutionOverviewSocket";
import { Separator } from "@shared/ui/kit/separator";
import { LoadingLayout } from "@shared/ui/layout";
import { TestCurrentQuestionWidget } from "@widgets/TestCurrentQuestion";
import { TestExecutionOverviewResponseRunModeEnum } from "@shared/api/generated";
import { WEBSOCKET_GROUPS, WebSocketProvider } from "@shared/websocket";

export const TestExecutionOverviewPage = () => {
	const { id } = useParams();

	const { isLoading, testOverview, error } = useGetTestOverview(id as string);

	useTestExecutionOverviewSocket(id as string);

	return (
		<LoadingLayout isLoading={isLoading} error={error}>
			{!!testOverview && (
				<div className="flex min-h-a w-full shrink flex-col gap-4 bg-gradient-to-b from-muted/40 via-background to-background px-10 pt-5 pb-8">
					<TestManageHeader testOverview={testOverview} />
					<Separator />

					{testOverview.run_mode === TestExecutionOverviewResponseRunModeEnum.Manual && <TestCurrentQuestionWidget testOverview={testOverview} />}

					<TestManageParticipants testOverview={testOverview} />
				</div>
			)}
		</LoadingLayout>
	);
};

export const TestExecutionOverview = () => {
	const { id } = useParams();

	return (
		<WebSocketProvider
			url={import.meta.env.VITE_WS_URL as string}
			shouldReconnect
			reconnectInterval={3000}
			heartbeat={{
				interval: 3000,
				message: "heartbeat",
			}}
			queryParams={{
				test_id: id as string,
				group: WEBSOCKET_GROUPS.TEACHER,
			}}
		>
			<TestExecutionOverviewPage />
		</WebSocketProvider>
	);
};
