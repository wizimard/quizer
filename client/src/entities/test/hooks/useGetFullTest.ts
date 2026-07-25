import { useQuery } from "@tanstack/react-query";
import { AxiosError, type AxiosResponse } from "axios";
import { normalizeTestFull, type Test, type TestFull } from "..";
import { testApi } from "@shared/api";
import type { TestFullResponse } from "@shared/api/generated";
import { QUERY_KEYS } from "@shared/constant";

export const useGetFullTest = (id: string) => {
	const { data, isLoading, error } = useQuery<Test>({
		queryKey: [QUERY_KEYS.GET_FULL_TEST, id],
		queryFn: async ({ signal }) => {
			const response: AxiosResponse<TestFullResponse> = await testApi.testTestIdGet(id, { signal });

			return normalizeTestFull(response.data);
		},
		retry: 3,
	});

	const isForbidden = error instanceof AxiosError && error.response?.status === 403;

	return { isLoading, error, isForbidden, test: data as TestFull };
};
