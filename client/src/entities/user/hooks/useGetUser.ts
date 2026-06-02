import { api } from "@shared/api";
import { useEffect, useState } from "react";
import { useUser } from "../model/store";

export const useGetUser = () => {
	const [isLoading, setIsLoading] = useState(true);
	const setUser = useUser((state) => state.setUser);

	useEffect(() => {
		(async () => {
			try {
				const response = await api.userMeGet();

				if (response.data) {
					setUser(response.data);
				}
			} catch {
				/* empty */
			}

			setIsLoading(false);
		})();
	}, []);

	return { isLoading };
};
