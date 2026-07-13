import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import type { TestExecution } from "../model/test-execution.interface";
import { normalizeExecutionTest } from "../lib/normalizeTest";
import { testExecutionApi } from "@shared/api";
import type { TestExecuteResponse } from "@shared/api/generated";
import { QUERY_KEYS } from "@shared/constant";

export function useGetExecutionTest(id: string) {
	const { data, isLoading, error } = useQuery<TestExecution>({
		queryKey: [QUERY_KEYS.GET_TEST_EXECUTION, id],
		queryFn: async () => {
			const response: AxiosResponse<TestExecuteResponse> = await testExecutionApi.testExecuteTestIdGet(id);

			return normalizeExecutionTest(response.data);
		},
		refetchInterval: (query) => {
			const test = query.state.data;

			return test && !test.isOpen ? 10_000 : false;
		},
	});

	return { isLoading, error, test: data as TestExecution };
}
