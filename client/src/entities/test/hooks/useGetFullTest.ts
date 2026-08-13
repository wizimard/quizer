import { useQuery } from "@tanstack/react-query";
import { type AxiosResponse } from "axios";
import { normalizeTestFull, type TestFull } from "..";
import { testApi } from "@shared/api";
import type { TestFullResponse } from "@shared/api/generated";
import { QUERY_KEYS } from "@shared/constant";

export const useGetFullTest = (id: string) => {
	const { data, isLoading, error } = useQuery<TestFull>({
		queryKey: [QUERY_KEYS.GET_FULL_TEST, id],
		queryFn: async ({ signal }) => {
			const response: AxiosResponse<TestFullResponse> = await testApi.testTestIdGet(id, { signal });

			return normalizeTestFull(response.data);
		},
		retry: 3,
	});

	return { isLoading, error, test: data as TestFull };
};
