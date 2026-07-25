import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { normalizeTestSessionOverview } from "../lib/normalizeTest";
import type { TestSessionOverview } from "../model/test-session-overview.interface";
import { testApi } from "@shared/api";
import type { TestSessionOverviewResponse } from "@shared/api/generated";

export const useGetTestSessionOverview = (testId: string, sessionId: string) => {
	const { data, isLoading, error } = useQuery<TestSessionOverview>({
		queryKey: ["test-session-overview", sessionId],
		queryFn: async () => {
			const response: AxiosResponse<TestSessionOverviewResponse> = await testApi.testTestIdHistorySessionIdGet(testId, sessionId);
			return normalizeTestSessionOverview(response.data);
		},
	});

	return { data: data as TestSessionOverview | undefined, isLoading, error };
};
