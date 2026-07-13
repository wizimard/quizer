import { useQuery } from "@tanstack/react-query";
import { type AxiosResponse } from "axios";
import { normalizeTest, type Test } from "..";
import { testApi } from "@shared/api";
import type { TestResponse } from "@shared/api/generated";
import { QUERY_KEYS } from "@shared/constant";

export interface IUseGetTests {
	isLoading: boolean;
	error: Error | null;
	tests: Test[] | undefined;
}

export const useGetTestes = (): IUseGetTests => {
	const { data, isLoading, error } = useQuery<Array<Test>>({
		queryKey: [QUERY_KEYS.GET_AUTHOR_TESTS],
		queryFn: async () => {
			const response: AxiosResponse<Array<TestResponse>> = await testApi.testGet();
			return response.data.map(normalizeTest);
		},
	});

	return { isLoading, error, tests: data };
};
