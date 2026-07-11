import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Text } from "@shared/ui/text";
import { CenterElement } from "@shared/ui/layout";
import { LoginForm } from "@features/auth/login";

function LoginPage() {
	const { t } = useTranslation();

	return (
		<CenterElement>
			<LoginForm />
			<Text className="flex items-center gap-1">
				{t("auth.login.bottom.text")}
				<NavLink to="/register" className="text-blue-500 capitalize">
					{t("auth.login.bottom.button")}
				</NavLink>
			</Text>
		</CenterElement>
	);
}

export default LoginPage;
