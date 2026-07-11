import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../model/store";
import { ACCESS_TOKEN_KEY } from "@shared/constant";
import type { UserAuthResponseUser } from "@shared/api/generated";
import { userApi } from "@shared/api";

export const useGetUser = () => {
	const storeUser = useUser((state) => state.user);
	const setUser = useUser((state) => state.setUser);
	const clearUser = useUser((state) => state.clearUser);
	const hasAccessToken: boolean = !!localStorage.getItem(ACCESS_TOKEN_KEY);

	const {
		data: userResponse,
		isLoading,
		error,
		isFetched,
	} = useQuery<UserAuthResponseUser>({
		queryKey: ["user"],
		queryFn: async () => {
			const response = await userApi.userMeGet();
			return response.data;
		},
		enabled: hasAccessToken,
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
