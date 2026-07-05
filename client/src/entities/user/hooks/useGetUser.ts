import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../model/store";
import { api } from "@shared/api";
import { ACCESS_TOKEN_KEY } from "@shared/constant";
import type { UserAuthResponseUser } from "@shared/api/generated";

export const useGetUser = () => {
	const storeUser = useUser((state) => state.user);
	const setUser = useUser((state) => state.setUser);
	const clearUser = useUser((state) => state.clearUser);
	const hasAccessToken = !!localStorage.getItem(ACCESS_TOKEN_KEY);

	const {
		data: userResponse,
		isLoading,
		error,
		isFetched,
	} = useQuery<UserAuthResponseUser>({
		queryKey: ["user"],
		queryFn: async () => {
			const response = await api.userMeGet();
			return response.data;
		},
		enabled: hasAccessToken,
		refetchOnMount: false,
	});

	useEffect(() => {
		if (userResponse) {
			setUser(userResponse);
		} else if (isFetched) {
			clearUser();
		}
	}, [userResponse, isFetched, setUser, clearUser]);

	const user = storeUser ?? userResponse ?? null;

	return { isLoading, error, user };
};
