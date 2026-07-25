import { useQuery } from "@tanstack/react-query";
import { normalizeTestExecutionOverview } from "../lib/normalizeTest";
import type { TestExecutionOverview } from "../model/test-execution-overview.interface";
import { testApi } from "@shared/api";
import { QUERY_KEYS } from "@shared/constant";

export const useGetTestOverview = (testId: string) => {
	const { data, isLoading, error } = useQuery<TestExecutionOverview>({
		queryKey: [QUERY_KEYS.GET_TEST_EXECUTION_OVERVIEW, testId],
		queryFn: async ({ signal }) => {
			const response = await testApi.testTestIdExecutionOverviewGet(testId, { signal });

			return normalizeTestExecutionOverview(response.data);
		},
		refetchInterval: (query) => {
			const overview = query.state.data;

			return overview && !overview.finished_at ? 5_000 : false;
		},
	});

	return {
		testOverview: data as TestExecutionOverview,
		error,
		isLoading,
	};
};
