import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { normalizeTestLaunch } from "../lib/normalizeTest";
import type { TestLaunchHistory } from "../model/test-lauch-history.interface";
import { QUERY_KEYS } from "@shared/constant";
import type { TestLaunchResponse } from "@shared/api/generated";
import { testApi } from "@shared/api";

export const useGetHistory = () => {
	const { data, isLoading, error } = useQuery<Array<TestLaunchHistory>>({
		queryKey: [QUERY_KEYS.GET_HISTORY],
		queryFn: async () => {
			const response: AxiosResponse<Array<TestLaunchResponse>> = await testApi.testHistoryGet();
			return response.data.map(normalizeTestLaunch);
		},
	});

	return { data: data as Array<TestLaunchHistory> | undefined, isLoading, error };
};
