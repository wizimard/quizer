import { useQuery } from "@tanstack/react-query";
import { AxiosError, type AxiosResponse } from "axios";
import { normalizeTestFull, type Test, type TestFull } from "..";
import { testApi } from "@shared/api";
import type { TestFullResponse } from "@shared/api/generated";

export const useGetTest = (id: string) => {
	const { data, isLoading, error } = useQuery<Test>({
		queryKey: ["test", id],
		queryFn: async () => {
			const response: AxiosResponse<TestFullResponse> = await testApi.testTestIdGet(id);

			return normalizeTestFull(response.data);
		},
	});

	const isForbidden = error instanceof AxiosError && error.response?.status === 403;

	return { isLoading, error, isForbidden, test: data as TestFull };
};
