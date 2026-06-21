import { Text } from "@shared/ui/text";
import { CenterElement } from "@shared/ui/layout";
import { NavLink } from "react-router-dom";
import { LoginForm } from "@features/auth";
import { useTranslation } from "react-i18next";

function LoginPage() {
	const { t } = useTranslation();

	return (
		<CenterElement>
			<LoginForm />
			<Text>
				{t("auth.register.login.text")} <NavLink to="/register">{t("auth.register.login.button")}</NavLink>
			</Text>
		</CenterElement>
	);
}

export default LoginPage;
