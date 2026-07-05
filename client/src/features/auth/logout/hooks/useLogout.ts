import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@entities/user";
import { api } from "@shared/api";
import { ACCESS_TOKEN_KEY } from "@shared/constant";

export const useLogout = () => {
	const clearUser = useUser((state) => state.clearUser);
	const queryClient = useQueryClient();

	const logout = async () => {
		try {
			await api.authLogoutPost();

			localStorage.removeItem(ACCESS_TOKEN_KEY);

			queryClient.removeQueries({ queryKey: ["user"] });
			clearUser();
		} catch {
			// empty
		}
	};

	return { logout };
};
