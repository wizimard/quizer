import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { normalizeTestLaunch } from "../lib/normalizeTest";
import type { TestLaunchHistory } from "../model/test-lauch-history.interface";
import { historyApi } from "@shared/api";
import { QUERY_KEYS } from "@shared/constant";
import type { TestLaunchResponse } from "@shared/api/generated";

export const useGetTestHistory = (testId: string) => {
	const { data, isLoading, error } = useQuery<Array<TestLaunchHistory>>({
		queryKey: [QUERY_KEYS.GET_TEST_HISTORY, testId],
		queryFn: async () => {
			const response: AxiosResponse<Array<TestLaunchResponse>> = await historyApi.historyTestIdGet(testId);
			return response.data.map(normalizeTestLaunch);
		},
		enabled: !!testId,
	});

	return { data: data as Array<TestLaunchHistory> | undefined, isLoading, error };
};
