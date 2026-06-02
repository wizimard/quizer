import { useLogout } from "@features/auth";
import { DefaultButton } from "@shared/ui/button";

export const Main = () => {
	const { logout } = useLogout();

	const handleClick = async () => {
		await logout();
	};

	return <DefaultButton onClick={handleClick}>Logout</DefaultButton>;
};
