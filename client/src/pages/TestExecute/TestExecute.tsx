import { useParams } from "react-router-dom";
import { memo } from "react";
import { TestExecuteContent } from "./ui/TestExecuteContent";
import { LoadingLayout } from "@shared/ui/layout";
import { useGetExecutionTest, useTestExecutionSocket } from "@entities/test";
import { WEBSOCKET_GROUPS, WebSocketProvider } from "@shared/websocket";

const TestExecutePage = memo(() => {
	const { id } = useParams();

	const { isLoading, error, test, refetch } = useGetExecutionTest(id as string);

	useTestExecutionSocket(refetch);

	return (
		<LoadingLayout isLoading={isLoading} error={error}>
			{!!test && <TestExecuteContent test={test} />}
		</LoadingLayout>
	);
});

export const TestExecute = () => {
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
				group: WEBSOCKET_GROUPS.PARTICIPANTS,
			}}
		>
			<TestExecutePage />
		</WebSocketProvider>
	);
};
