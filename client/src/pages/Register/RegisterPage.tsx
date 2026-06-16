import { RegisterForm } from "@features/auth";
import { CenterElement } from "@shared/ui/layout";
import { Text } from "@shared/ui/text";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

function RegisterPage() {
	const { t } = useTranslation();

	return (
		<CenterElement>
			<RegisterForm />
			<Text>
				{t("auth.register.bottom.text")} <NavLink to="/login">{t("auth.register.bottom.button")}</NavLink>
			</Text>
		</CenterElement>
	);
}

export default RegisterPage;
