import { useUser } from "@entities/user";
import { api } from "@shared/api";
import { ACCESS_TOKEN_KEY } from "@shared/constant";

export const useLogout = () => {
	const setUser = useUser((state) => state.setUser);

	const logout = async () => {
		try {
			await api.authLogoutPost();

			localStorage.removeItem(ACCESS_TOKEN_KEY);

			setUser(null);
		} catch {
			// empty
		}
	};

	return { logout };
};
