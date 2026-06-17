import type { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

export const useApi = <T extends object>(callback: () => Promise<AxiosResponse<T, unknown, object>> | null | T) => {
	const [data, setData] = useState<T | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await callback();

				if ("data" in response) {
					setData(response.data);
				} else {
					setData(response as T);
				}
			} catch (err: unknown) {
				if (!(err instanceof Error)) {
					return;
				}
				setError(err);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [callback]);

	return { data, isLoading, error };
};
