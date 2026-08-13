import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import type { TestExecution } from "../model/test-execution.interface";
import { normalizeExecutionTest } from "../lib/normalizeTest";
import { useTestExecutionStore } from "../model/test-execution.store";
import { testExecutionApi } from "@shared/api";
import { TestExecuteResponseStatusEnum, type TestExecuteResponse } from "@shared/api/generated";
import { QUERY_KEYS } from "@shared/constant";

export function useGetExecutionTest(id: string) {
	const setStatus = useTestExecutionStore((state) => state.setStatus);

	const { data, isLoading, error, refetch } = useQuery<TestExecution>({
		queryKey: [QUERY_KEYS.GET_TEST_EXECUTION, id],
		queryFn: async ({ signal }) => {
			const response: AxiosResponse<TestExecuteResponse> = await testExecutionApi.testExecuteTestIdGet(id, { signal });

			const test = normalizeExecutionTest(response.data);

			setStatus(test.status === TestExecuteResponseStatusEnum.OpenByScheduler ? "open" : test.status);

			return test;
		},
		refetchInterval: (query) => {
			const test = query.state.data;

			return test && !test.isOpen ? 10_000 : false;
		},
		retry: 3,
	});

	return { isLoading, error, test: data as TestExecution, refetch };
}
